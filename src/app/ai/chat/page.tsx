/**
 * AI Chat Page
 * 
 * Interactive chat interface for conversing with portfolio AI assistant
 */

import React from 'react';
import { Metadata } from 'next';
import { PageHeader, PageSection } from '@/components/layouts';
import { SectionHeader } from '@/components/SectionHeader';
import { MotionFade } from '@/components/MotionFade';
import ChatPageClient from './client';

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'Chat with an AI assistant about the portfolio, projects, and AI research',
  openGraph: {
    title: 'AI Chat',
    description: 'Chat with an AI assistant about the portfolio, projects, and AI research',
  },
};

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      {/* Header */}
      <PageHeader
        title="AI Chat Assistant"
        subtitle="Conversational AI"
        description="Ask questions about projects, research, and technical topics"
      />

      <PageSection>
        {/* Introduction */}
        <MotionFade delay={0.1} className="mb-8">
          <SectionHeader title="Chat Interface" />
          <p className="text-slate-400 leading-relaxed max-w-2xl mt-3">
            This chat interface connects to an AI assistant trained to discuss portfolio content,
            answer technical questions, and explain projects. The assistant has context about:
          </p>
          <ul className="text-slate-400 text-sm mt-4 ml-4 space-y-2">
            <li>✓ AI and machine learning projects</li>
            <li>✓ Custom hardware systems and infrastructure</li>
            <li>✓ Full-stack software engineering work</li>
            <li>✓ Open-source contributions</li>
            <li>✓ Technical blog posts and research</li>
          </ul>
        </MotionFade>

        {/* Chat Interface */}
        <MotionFade delay={0.2}>
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 min-h-96">
            <ChatPageClient />
          </div>
        </MotionFade>

        {/* Features and Tips */}
        <MotionFade delay={0.3} className="mt-12 pt-8 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">💾</span>
                  <span>Message history is automatically saved</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">⚡</span>
                  <span>Real-time responses with token counting</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">🛡️</span>
                  <span>Rate limiting (20 messages per minute)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✏️</span>
                  <span>Edit and delete messages from conversation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">🔄</span>
                  <span>Clear chat to start a new conversation</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Tips for Better Responses</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>• <strong>Be specific:</strong> Detailed questions get better answers</li>
                <li>• <strong>Ask follow-ups:</strong> The AI maintains conversation context</li>
                <li>• <strong>Code questions:</strong> Ask for code examples and explanations</li>
                <li>• <strong>Project info:</strong> Ask about specific projects in the portfolio</li>
                <li>• <strong>Technical depth:</strong> Request deep dives on AI/ML topics</li>
              </ul>
            </div>
          </div>
        </MotionFade>

        {/* Example Questions */}
        <MotionFade delay={0.4} className="mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">Example Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-sm text-slate-300">
                "What AI/ML projects are in the portfolio?"
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-sm text-slate-300">
                "Tell me about the GPU training infrastructure"
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-sm text-slate-300">
                "What open-source projects are maintained?"
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-sm text-slate-300">
                "Explain the full-stack architecture"
              </p>
            </div>
          </div>
        </MotionFade>

        {/* API Note */}
        <MotionFade delay={0.5} className="mt-12 pt-8 border-t border-slate-800">
          <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
            <p className="text-sm text-blue-200">
              <strong>Note:</strong> This chat requires an OpenAI API key configured in environment variables
              (OPENAI_API_KEY). Set this to enable the chat functionality. Messages are processed through GPT-4
              Turbo for accurate, contextual responses.
            </p>
          </div>
        </MotionFade>
      </PageSection>
    </main>
  );
}
