'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionFade } from '@/components/MotionFade';
import {
  BarChart3,
  Download,
  Upload,
  Trash2,
  FileJson,
  FileText,
  AlertCircle,
  CheckCircle,
  Lock,
} from 'lucide-react';

interface ContentStats {
  blog?: { count: number; featured: number };
  research?: { count: number; categories: string[] };
  project?: { count: number; featured: number; technologies: string[] };
}

export function AdminAnalytics() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'export' | 'delete'>('stats');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'jsonl'>('json');
  const [deleteType, setDeleteType] = useState<'blog' | 'research' | 'project' | 'all'>('blog');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getAuthHeaders = () => ({
    'X-Admin-Token': adminToken,
    'Content-Type': 'application/json',
  });

  const handleAuth = (token: string) => {
    setAdminToken(token);
    setAuthenticated(!!token);
    loadStats();
  };

  const loadStats = async () => {
    if (!adminToken) return;

    setLoading(true);
    try {
      const response = await fetch('/api/import-export?action=stats', {
        headers: { 'X-Admin-Token': adminToken },
      });
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to load statistics' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const types = deleteType === 'all' ? 'blog,research,project' : deleteType;
      const response = await fetch(
        `/api/import-export?action=export&types=${types}&format=${exportFormat}`,
        {
          headers: { 'X-Admin-Token': adminToken },
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-export-${new Date().toISOString().split('T')[0]}.${exportFormat === 'jsonl' ? 'jsonl' : exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', text: 'Content exported successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: `Export error: ${error instanceof Error ? error.message : 'Unknown'}` });
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setMessage({ type: 'error', text: 'Please confirm deletion' });
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/import-export', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: deleteType === 'all' ? undefined : deleteType,
          confirm: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Deleted ${result.imported} item(s). Failed: ${result.failed}`,
        });
        setDeleteConfirm(false);
        loadStats();
      } else {
        setMessage({ type: 'error', text: result.message || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown'}` });
    } finally {
      setDeleting(false);
    }
  };

  if (!authenticated) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your admin token to access analytics and bulk operations.
            </p>
            <input
              data-testid="admin-analytics-auth-input"
              type="password"
              placeholder="Admin Token"
              value={adminToken}
              onChange={e => handleAuth(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <MotionFade>
      <div className="space-y-8">
        {/* Message */}
        {message && (
          <Card data-testid="admin-analytics-message"
            className={`border-l-4 ${
              message.type === 'success'
                ? 'border-l-green-500 bg-green-500/10'
                : 'border-l-red-500 bg-red-500/10'
            }`}
          >
            <CardContent className="pt-6 flex items-start gap-3">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {message.text}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          <button
            data-testid="admin-analytics-tab-stats"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-medium transition whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </div>
          </button>
          <button
            data-testid="admin-analytics-tab-export"
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 font-medium transition whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </div>
          </button>
          <button
            data-testid="admin-analytics-tab-delete"
            onClick={() => setActiveTab('delete')}
            className={`px-4 py-2 font-medium transition whitespace-nowrap ${
              activeTab === 'delete'
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Bulk Delete
            </div>
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {stats?.blog && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Blog Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold text-2xl">{stats.blog.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Featured</span>
                        <span className="font-bold">{stats.blog.featured}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {stats?.research && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Research</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold text-2xl">{stats.research.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categories</span>
                        <span className="font-bold">{stats.research.categories.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {stats?.project && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold text-2xl">{stats.project.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Featured</span>
                        <span className="font-bold">{stats.project.featured}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Content Type</label>
                <select
                  value={deleteType}
                  onChange={e => setDeleteType(e.target.value as any)}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="blog">Blog Posts Only</option>
                  <option value="research">Research Only</option>
                  <option value="project">Projects Only</option>
                  <option value="all">All Content</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Format</label>
                <div className="flex gap-2 mt-2">
                  {(['json', 'csv', 'jsonl'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`flex-1 px-3 py-2 rounded-md font-medium transition ${
                        exportFormat === format
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                data-testid="admin-analytics-export-action"
                onClick={handleExport}
                disabled={exporting}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Exporting...' : 'Download Content'}
              </button>
            </CardContent>
          </Card>
        )}

        {/* Delete Tab */}
        {activeTab === 'delete' && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Trash2 className="w-5 h-5" />
                Bulk Delete Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold">⚠️ Warning</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  This action cannot be undone. Make sure you have backed up your content.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Content Type to Delete</label>
                <select
                  value={deleteType}
                  onChange={e => setDeleteType(e.target.value as any)}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="blog">Blog Posts Only</option>
                  <option value="research">Research Only</option>
                  <option value="project">Projects Only</option>
                  <option value="all">All Content (DELETE EVERYTHING)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  data-testid="admin-analytics-delete-confirm"
                  type="checkbox"
                  id="deleteConfirm"
                  checked={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="deleteConfirm" className="text-sm text-foreground">
                  I understand this will permanently delete all {deleteType} content
                </label>
              </div>

              <button
                data-testid="admin-analytics-delete-action"
                onClick={handleDelete}
                disabled={!deleteConfirm || deleting}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-md transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Deleting...' : 'Delete Content'}
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </MotionFade>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8" data-testid="admin-analytics-page">
      <div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="admin-analytics-title">Admin Analytics</h1>
        <p className="text-muted-foreground mt-2" data-testid="admin-analytics-description">Statistics, export, and bulk operations</p>
      </div>

      <AdminAnalytics />
    </div>
  );
}
