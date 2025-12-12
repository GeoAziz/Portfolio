/**
 * Chat Utilities
 * 
 * Helper functions for chat message management, formatting, and API interactions
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tokens?: number;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model: string;
  temperature: number;
}

export interface ChatConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

/**
 * Generate unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new chat message
 */
export function createMessage(
  role: 'user' | 'assistant',
  content: string,
  tokens?: number
): ChatMessage {
  return {
    id: generateMessageId(),
    role,
    content,
    timestamp: Date.now(),
    tokens,
  };
}

/**
 * Create a new chat session
 */
export function createSession(model: string = 'gpt-4-turbo'): ChatSession {
  return {
    id: generateSessionId(),
    title: 'New Conversation',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    model,
    temperature: 0.7,
  };
}

/**
 * Format message for display
 */
export function formatMessage(message: ChatMessage): string {
  let formatted = message.content;

  // Convert markdown-style formatting
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');

  // Convert code blocks
  formatted = formatted.replace(/```[\s\S]*?```/g, '<code>$&</code>');
  formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

  // Convert links
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  return formatted;
}

/**
 * Calculate estimated tokens (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Build context from message history for API request
 */
export function buildContext(messages: ChatMessage[], maxMessages: number = 10): ChatMessage[] {
  // Keep only recent messages to avoid exceeding token limits
  const recentMessages = messages.slice(-maxMessages);
  return recentMessages;
}

/**
 * Format conversation for display in UI
 */
export function formatConversation(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((msg) => ({
    ...msg,
  }));
}

/**
 * Check if message contains code
 */
export function hasCode(content: string): boolean {
  return /```|`/.test(content);
}

/**
 * Extract code blocks from message
 */
export function extractCodeBlocks(content: string): string[] {
  const codeBlocks: string[] = [];
  const regex = /```([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    codeBlocks.push(match[1].trim());
  }

  return codeBlocks;
}

/**
 * Check rate limit (messages per minute)
 */
export function checkRateLimit(
  messageTimestamps: number[],
  limit: number = 20,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const recentMessages = messageTimestamps.filter((ts) => now - ts < windowMs);
  return recentMessages.length < limit;
}

/**
 * Get rate limit status
 */
export function getRateLimitStatus(
  messageTimestamps: number[],
  limit: number = 20,
  windowMs: number = 60000
): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const recentMessages = messageTimestamps.filter((ts) => now - ts < windowMs);
  const oldestRecentMessage = recentMessages.length > 0 ? Math.min(...recentMessages) : now;
  const resetIn = Math.max(0, oldestRecentMessage + windowMs - now);

  return {
    allowed: recentMessages.length < limit,
    remaining: Math.max(0, limit - recentMessages.length),
    resetIn,
  };
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

/**
 * System prompt for portfolio-specific AI assistant
 */
export const DEFAULT_SYSTEM_PROMPT = `You are an AI assistant for Astreaus, a software engineer and AI researcher's portfolio.
You help visitors learn about:
- AI/ML projects and research
- Custom hardware systems and infrastructure
- Full-stack software engineering work
- Open-source contributions
- Technical blog posts and documentation

Be helpful, concise, and technical. Reference the portfolio content when relevant.
Keep responses under 500 tokens unless a longer explanation is needed.
If asked about something not in the portfolio, say "I don't have information about that in the portfolio."`;

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith('sk-') && apiKey.length > 20;
}

/**
 * Sanitize user input to prevent injection
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 2000) // Limit length
    .replace(/[<>]/g, ''); // Remove angle brackets
}
