/**
 * Chat Page Client Component
 * 
 * Client-side chat interface with hooks and state management
 */

'use client';

import React, { useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useChat } from '@/hooks/use-chat';

export default function ChatPageClient() {
  const {
    session,
    messages,
    isLoading,
    error,
    rateLimit,
    startSession,
    sendMessage,
    clearChat,
    deleteMessage,
    resetError,
  } = useChat({
    apiEndpoint: '/api/chat',
    maxMessages: 20,
    rateLimit: 20,
  });

  // Start session on mount
  useEffect(() => {
    if (!session) {
      startSession();
    }
  }, [session, startSession]);

  // Reset error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(resetError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, resetError]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin">💭</div>
          <p className="text-slate-400 mt-4">Starting chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      messages={messages}
      isLoading={isLoading}
      error={error}
      onSendMessage={sendMessage}
      onClear={clearChat}
      onDeleteMessage={deleteMessage}
      rateLimit={rateLimit}
    />
  );
}
