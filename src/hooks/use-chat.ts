/**
 * useChat Hook
 * 
 * React hook for managing chat state and API interactions
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ChatMessage,
  ChatSession,
  createMessage,
  createSession,
  generateSessionId,
  estimateTokens,
  checkRateLimit,
  getRateLimitStatus,
  sanitizeInput,
  DEFAULT_SYSTEM_PROMPT,
} from '@/lib/chat';

interface UseChatOptions {
  systemPrompt?: string;
  apiEndpoint?: string;
  maxMessages?: number;
  rateLimit?: number;
}

interface UseChatReturn {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  rateLimit: { allowed: boolean; remaining: number; resetIn: number };
  
  // Actions
  startSession: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  deleteMessage: (id: string) => void;
  editMessage: (id: string, content: string) => void;
  resetError: () => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    apiEndpoint = '/api/chat',
    maxMessages = 20,
    rateLimit = 20,
  } = options;

  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageTimestampsRef = useRef<number[]>([]);

  // Recover session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('chatSession');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
        setMessages(parsed.messages);
      } catch (e) {
        console.error('Failed to restore chat session:', e);
      }
    }
  }, []);

  // Save session to localStorage
  const saveSession = useCallback((updatedSession: ChatSession) => {
    try {
      localStorage.setItem('chatSession', JSON.stringify(updatedSession));
    } catch (e) {
      console.error('Failed to save chat session:', e);
    }
  }, []);

  // Start new chat session
  const startSession = useCallback(() => {
    const newSession = createSession('gpt-4-turbo');
    setSession(newSession);
    setMessages([]);
    setError(null);
    messageTimestampsRef.current = [];
    saveSession(newSession);
  }, [saveSession]);

  // Get rate limit status
  const getRateLimitInfo = useCallback(() => {
    return getRateLimitStatus(messageTimestampsRef.current, rateLimit);
  }, [rateLimit]);

  // Send message to AI
  const sendMessage = useCallback(
    async (content: string) => {
      if (!session) {
        setError('No active chat session. Start a new conversation first.');
        return;
      }

      // Validate rate limit
      const rateLimitStatus = getRateLimitInfo();
      if (!rateLimitStatus.allowed) {
        setError(
          `Rate limited. Please wait ${Math.ceil(rateLimitStatus.resetIn / 1000)}s before sending another message.`
        );
        return;
      }

      // Sanitize and validate input
      const sanitized = sanitizeInput(content);
      if (!sanitized) {
        setError('Message cannot be empty');
        return;
      }

      if (sanitized.length > 2000) {
        setError('Message is too long (max 2000 characters)');
        return;
      }

      // Create user message
      const userMessage = createMessage('user', sanitized, estimateTokens(sanitized));
      const updatedMessages = [...messages, userMessage];

      // Update state and track timestamp
      setMessages(updatedMessages);
      messageTimestampsRef.current.push(Date.now());
      setError(null);
      setIsLoading(true);

      try {
        // Call API endpoint
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            systemPrompt,
            model: session.model,
            temperature: session.temperature,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.content) {
          throw new Error('Invalid response from API');
        }

        // Create assistant message
        const assistantMessage = createMessage(
          'assistant',
          data.content,
          estimateTokens(data.content)
        );

        // Update messages and session
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);

        // Update session
        const updatedSession: ChatSession = {
          ...session,
          messages: finalMessages,
          updatedAt: Date.now(),
          title: finalMessages[0]?.content.slice(0, 50) || 'New Conversation',
        };

        setSession(updatedSession);
        saveSession(updatedSession);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
        setError(errorMessage);

        // Add error message to chat
        const errorMsg = createMessage(
          'assistant',
          `Error: ${errorMessage}. Please try again.`
        );
        errorMsg.error = errorMessage;

        setMessages([...updatedMessages, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [session, messages, apiEndpoint, systemPrompt, getRateLimitInfo, saveSession]
  );

  // Clear entire chat
  const clearChat = useCallback(() => {
    if (session) {
      const clearedSession = {
        ...session,
        messages: [],
        updatedAt: Date.now(),
      };
      setSession(clearedSession);
      setMessages([]);
      saveSession(clearedSession);
    }
  }, [session, saveSession]);

  // Delete single message
  const deleteMessage = useCallback(
    (id: string) => {
      const updatedMessages = messages.filter((m) => m.id !== id);
      setMessages(updatedMessages);

      if (session) {
        const updatedSession = {
          ...session,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
        setSession(updatedSession);
        saveSession(updatedSession);
      }
    },
    [messages, session, saveSession]
  );

  // Edit message
  const editMessage = useCallback(
    (id: string, newContent: string) => {
      const updatedMessages = messages.map((m) =>
        m.id === id
          ? {
              ...m,
              content: newContent,
              tokens: estimateTokens(newContent),
            }
          : m
      );

      setMessages(updatedMessages);

      if (session) {
        const updatedSession = {
          ...session,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
        setSession(updatedSession);
        saveSession(updatedSession);
      }
    },
    [messages, session, saveSession]
  );

  // Reset error
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    session,
    messages,
    isLoading,
    error,
    rateLimit: getRateLimitInfo(),
    startSession,
    sendMessage,
    clearChat,
    deleteMessage,
    editMessage,
    resetError,
  };
}
