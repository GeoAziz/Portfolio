'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Edit, Trash2, RotateCcw, X } from 'lucide-react';

interface ContentItem {
  type: 'blog' | 'research' | 'project';
  slug: string;
  title: string;
  data: any;
}

export function ContentEditor() {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [adminToken, setAdminToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const getAuthHeaders = () => ({
    'X-Admin-Token': adminToken,
    'Content-Type': 'application/json',
  });

  const handleAuth = (token: string) => {
    setAdminToken(token);
    setAuthenticated(!!token);
  };

  const handleSelectItem = (item: ContentItem) => {
    setSelectedItem(item);
    setEditData(item.data);
    setMessage(null);
  };

  const handleEditField = (key: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    setLoading(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: selectedItem.type,
          slug: selectedItem.slug,
          updates: editData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `${selectedItem.type} updated successfully` });
        setSelectedItem(null);
        setEditData({});
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to save' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    if (!confirm(`Are you sure you want to delete this ${selectedItem.type}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/content', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: selectedItem.type,
          slug: selectedItem.slug,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `${selectedItem.type} deleted successfully` });
        setSelectedItem(null);
        setEditData({});
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown'}` });
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Admin Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your admin token to access content editing tools.
            </p>
            <input
              type="password"
              placeholder="Admin Token"
              value={adminToken}
              onChange={e => handleAuth(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Token is required for all edit/delete operations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Card
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

      {selectedItem ? (
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedItem.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Editing: {selectedItem.type}</p>
            </div>
            <button
              onClick={() => {
                setSelectedItem(null);
                setEditData({});
              }}
              className="p-2 hover:bg-accent rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="space-y-4">
            {Object.entries(editData).map(([key, value]) => {
              if (key === 'slug' || key === 'createdAt') return null;

              return (
                <div key={key}>
                  <label className="text-sm font-semibold text-foreground">{key}</label>
                  {typeof value === 'string' ? (
                    value.length > 100 ? (
                      <textarea
                        value={value}
                        onChange={e => handleEditField(key, e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        rows={4}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={e => handleEditField(key, e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    )
                  ) : typeof value === 'boolean' ? (
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={e => handleEditField(key, e.target.checked)}
                      className="mt-2"
                    />
                  ) : (
                    <textarea
                      value={JSON.stringify(value, null, 2)}
                      onChange={e => {
                        try {
                          handleEditField(key, JSON.parse(e.target.value));
                        } catch {
                          // Keep raw text if not valid JSON
                        }
                      }}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground font-mono text-sm"
                      rows={3}
                    />
                  )}
                </div>
              );
            })}

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-md transition"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-md transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p>Select an item to edit or create a new one</p>
        </div>
      )}
    </div>
  );
}
