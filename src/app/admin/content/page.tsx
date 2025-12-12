'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionFade } from '@/components/MotionFade';
import { AlertCircle, CheckCircle, FileText, Tag, Layers, Lock, History } from 'lucide-react';
import { ContentEditor } from '@/components/ContentEditor';

interface ChangeLog {
  type: 'create' | 'update' | 'delete';
  contentType: 'blog' | 'research' | 'project';
  slug: string;
  timestamp: string;
}

export default function AdminContentPage() {
  const [tab, setTab] = useState<'editor' | 'audit' | 'history'>('editor');
  const [changeLog, setChangeLog] = useState<ChangeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  const loadChangeLog = async () => {
    if (!adminToken) return;

    setLoading(true);
    try {
      const response = await fetch('/api/content?limit=50', {
        headers: { 'X-Admin-Token': adminToken },
      });
      const result = await response.json();
      if (result.success) {
        setChangeLog(result.data);
      }
    } catch (error) {
      console.error('Error loading change log:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionFade>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground mt-2">Edit, delete, and manage all site content</p>
        </div>

        {/* Admin Token Input */}
        {!adminToken && (
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your admin token to access content management features.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Admin Token"
                  value={adminToken}
                  onChange={e => setAdminToken(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && loadChangeLog()}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
                <button
                  onClick={loadChangeLog}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                  Authenticate
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {adminToken && (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setTab('editor')}
                className={`px-4 py-2 font-medium transition ${
                  tab === 'editor'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setTab('history')}
                className={`px-4 py-2 font-medium transition flex items-center gap-2 ${
                  tab === 'history'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <History className="w-4 h-4" />
                Change History
              </button>
            </div>

            {/* Tab Content */}
            {tab === 'editor' && <ContentEditor />}

            {tab === 'history' && (
              <div className="space-y-4">
                {changeLog.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <p>No changes recorded yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  changeLog.map((log, idx) => (
                    <Card key={idx} className="bg-card border-border">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{log.slug}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {log.type} · {log.contentType}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              log.type === 'create'
                                ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                : log.type === 'update'
                                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                : 'bg-red-500/20 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MotionFade>
  );
}
