'use client';
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { TopBar } from '@/components/dashboard/TopBar';

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'Which clients need my attention this week?',
  "Show me deals that haven't progressed in 2 weeks.",
  'Summarise my recent meetings.',
  'Which opportunities should my team prioritise?',
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, conversationId: convId }),
      });
      const data = await res.json() as { message?: string; error?: string; conversationId?: string };
      if (data.conversationId) setConvId(data.conversationId);
      setMessages([...newMessages, { role: 'assistant', content: data.message ?? data.error ?? 'Something went wrong.' }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Failed to reach AI Associate. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="AI Associate" subtitle="Your intelligent brokerage assistant" />
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center pt-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ai-purple to-purple-900 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">AI Associate</h2>
            <p className="text-gray-500 mb-8">Ask me anything about your clients, deals, meetings, or tasks. I have access to your live business data.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-4 bg-white border border-gray-100 rounded-xl hover:border-ai-purple/40 hover:bg-purple-50/30 transition-colors text-sm text-gray-600"
                >
                  <Sparkles className="w-3.5 h-3.5 text-ai-purple inline mr-2" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-forest text-white'
                      : 'bg-white border border-gray-100 text-charcoal shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-ai-purple" />
                      <span className="text-xs font-semibold text-ai-purple">AI Associate</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Spinner className="text-ai-purple w-4 h-4" />
                    <span className="text-xs text-ai-purple">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
                placeholder="Ask anything about your brokerage..."
                rows={1}
                className="input resize-none pr-12"
                style={{ minHeight: 44, maxHeight: 120 }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-ai-purple hover:bg-purple-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">AI Associate uses your live business data. Add a Gemini API key to enable.</p>
        </div>
      </div>
    </div>
  );
}
