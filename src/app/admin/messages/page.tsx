'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MotionFade } from '@/components/MotionFade';
import { Trash2, Eye, Download, Mail, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual authentication
  const isAuthorized = true;

  useEffect(() => {
    if (!isAuthorized) {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact', {
        headers: {
          'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch messages'
      );
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Name', 'Email', 'Subject', 'Message', 'Read'],
      ...messages.map(msg => [
        new Date(msg.createdAt).toLocaleString(),
        msg.name,
        msg.email,
        msg.subject,
        msg.message.replace(/"/g, '""'), // Escape quotes
        msg.read ? 'Yes' : 'No',
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Access Denied
            </p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-2">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-lg bg-accent/20 animate-pulse" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Error Loading Messages
            </p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-2">
              {error}
            </p>
            <Button
              onClick={fetchMessages}
              variant="outline"
              className="mt-4 w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <MotionFade>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Manage and respond to contact form submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-3xl font-bold text-foreground">{messages.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            'bg-card border-border',
            unreadCount > 0 && 'border-yellow-500/20 bg-yellow-500/5'
          )}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className={cn(
                  'text-3xl font-bold',
                  unreadCount > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
                )}>
                  {unreadCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Read</p>
                <p className="text-3xl font-bold text-foreground">
                  {messages.length - unreadCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        {messages.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export as CSV
            </Button>
          </div>
        )}

        {/* Messages List */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Messages Column */}
          <div className="lg:col-span-2 space-y-4">
            {messages.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-12 pb-8">
                  <div className="text-center">
                    <Mail className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Messages will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              messages.map(message => (
                <Card
                  key={message.id}
                  className={cn(
                    'bg-card border-border cursor-pointer transition-colors hover:border-accent',
                    selectedMessage?.id === message.id && 'border-accent bg-accent/5',
                    !message.read && 'border-yellow-500/30'
                  )}
                  onClick={() => {
                    setSelectedMessage(message);
                    handleMarkAsRead(message.id);
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {message.subject}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            From: {message.name} ({message.email})
                          </p>
                        </div>
                        {!message.read && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.message}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Message Detail Column */}
          <div>
            {selectedMessage ? (
              <Card className="bg-card border-border sticky top-4">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">
                        {selectedMessage.subject}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {selectedMessage.name}
                      </CardDescription>
                    </div>
                    {!selectedMessage.read && (
                      <Badge variant="secondary" className="flex-shrink-0">
                        Unread
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Contact Info */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedMessage.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Message</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2"
                      asChild
                    >
                      <a href={`mailto:${selectedMessage.email}`}>
                        <Mail className="w-4 h-4" />
                        Reply
                      </a>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Eye className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Select a message to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MotionFade>
  );
}
