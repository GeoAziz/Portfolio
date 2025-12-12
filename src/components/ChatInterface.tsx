/**
 * Chat Interface Component
 * 
 * Complete chat UI with message display, input, and controls
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage as ChatMsg } from '@/lib/chat';

interface ChatInterfaceProps {
  messages: ChatMsg[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => Promise<void>;
  onClear: () => void;
  onDeleteMessage?: (id: string) => void;
  rateLimit?: { allowed: boolean; remaining: number; resetIn: number };
}

function MessageBubble({ message, onDelete }: { message: ChatMsg; onDelete?: () => void }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-slate-800 text-slate-100 rounded-bl-none'
        }`}
      >
        {message.error ? (
          <div className="text-red-200 text-sm">{message.error}</div>
        ) : (
          <>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
            {message.tokens && (
              <p className="text-xs opacity-60 mt-2">
                ~{message.tokens} tokens
              </p>
            )}
          </>
        )}

        {onDelete && !isUser && (
          <button
            onClick={onDelete}
            className="text-xs opacity-50 hover:opacity-100 mt-2 transition-opacity"
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function ChatInterface({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClear,
  onDeleteMessage,
  rateLimit,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle send
  const handleSend = async () => {
    if (!input.trim() || isSubmitting || isLoading) return;

    if (rateLimit && !rateLimit.allowed) {
      alert(`Rate limited. Please wait ${Math.ceil(rateLimit.resetIn / 1000)}s.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSendMessage(input);
      setInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-900 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
        {messages.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-3">💬</div>
              <p className="text-slate-400 text-sm">
                Start a conversation by sending a message
              </p>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onDelete={
                    onDeleteMessage && msg.role === 'assistant'
                      ? () => onDeleteMessage(msg.id)
                      : undefined
                  }
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-slate-800 rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-xs text-slate-400">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-red-900/30 border-t border-red-700/50 text-red-200 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Rate Limit Info */}
      {rateLimit && !rateLimit.allowed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-amber-900/30 border-t border-amber-700/50 text-amber-200 text-sm"
        >
          Rate limited: {Math.ceil(rateLimit.resetIn / 1000)}s remaining
        </motion.div>
      )}

      {/* Input Area */}
      <div className="px-4 py-4 border-t border-slate-700 bg-slate-900">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message (Shift+Enter for new line)..."
            rows={3}
            disabled={isSubmitting || isLoading}
            className="flex-1 px-3 py-2 bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSubmitting || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
          >
            {isSubmitting || isLoading ? '...' : 'Send'}
          </button>
        </div>

        {rateLimit && (
          <p className="text-xs text-slate-500 mt-2">
            {rateLimit.allowed
              ? `${rateLimit.remaining}/${20} messages remaining this minute`
              : `Rate limited until ${new Date(Date.now() + rateLimit.resetIn).toLocaleTimeString()}`}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;
