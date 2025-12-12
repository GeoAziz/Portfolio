'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Webhook {
  id: string;
  userId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  statusCode?: number;
  responseTime: number;
  success: boolean;
  error?: string;
  timestamp: string;
}

const WEBHOOK_EVENTS = [
  'content.created',
  'content.updated',
  'content.deleted',
  'user.registered',
  'user.updated',
  'comment.created',
  'comment.deleted',
  'analytics.event',
];

export default function WebhooksPage() {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    events: [] as string[],
  });

  useEffect(() => {
    fetchWebhooks();
  }, []);

  async function fetchWebhooks() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/webhooks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch webhooks');
      }

      const data = await response.json();
      setWebhooks(data.webhooks || []);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to load webhooks',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateWebhook(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: formData.url,
          events: formData.events,
          active: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create webhook');
      }

      const data = await response.json();
      setWebhooks([...webhooks, data.webhook]);
      setFormData({ url: '', events: [] });
      setMessage({ type: 'success', text: 'Webhook created successfully!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to create webhook',
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleTestWebhook(webhookId: string) {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/webhooks?action=test&id=${webhookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Test failed');
      }

      setMessage({ type: 'success', text: 'Webhook test triggered!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Webhook test failed',
      });
    }
  }

  async function handleDeleteWebhook(webhookId: string) {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete webhook');
      }

      setWebhooks(webhooks.filter((w) => w.id !== webhookId));
      setMessage({ type: 'success', text: 'Webhook deleted!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete webhook',
      });
    }
  }

  async function handleFetchLogs(webhookId: string) {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/webhooks?action=logs&webhookId=${webhookId}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data.logs || []);
      setShowLogs(true);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to fetch logs',
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading webhooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Webhooks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your webhook integrations</p>
          </div>
          <Link
            href="/user/profile"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Profile
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Create Webhook Form */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Webhook</h2>
          <form onSubmit={handleCreateWebhook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/webhook"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Events
              </label>
              <div className="grid grid-cols-2 gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                {WEBHOOK_EVENTS.map((event) => (
                  <label key={event} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            events: [...formData.events, event],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            events: formData.events.filter((ev) => ev !== event),
                          });
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{event}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating || !formData.url || formData.events.length === 0}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Webhook'}
            </button>
          </form>
        </div>

        {/* Webhooks List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Webhooks</h2>
          {webhooks.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">No webhooks yet. Create one above!</p>
            </div>
          ) : (
            webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white break-all">{webhook.url}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Created {new Date(webhook.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        webhook.active
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Events:</p>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {webhook.failureCount > 0 && (
                    <p>
                      ⚠️ {webhook.failureCount} recent failure{webhook.failureCount !== 1 ? 's' : ''}
                    </p>
                  )}
                  {webhook.lastTriggeredAt && (
                    <p>
                      Last triggered: {new Date(webhook.lastTriggeredAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleTestWebhook(webhook.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWebhook(webhook);
                      handleFetchLogs(webhook.id);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logs
                  </button>
                  <button
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Logs Modal */}
        {showLogs && selectedWebhook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Webhook Logs</h3>
                <button
                  onClick={() => setShowLogs(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                {logs.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No logs yet</p>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded text-sm"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span
                            className={`font-semibold ${
                              log.success ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {log.event}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {log.statusCode && `Status: ${log.statusCode}`}
                          {log.responseTime && ` • ${log.responseTime}ms`}
                        </p>
                        {log.error && (
                          <p className="text-red-600 dark:text-red-400 mt-1">{log.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
