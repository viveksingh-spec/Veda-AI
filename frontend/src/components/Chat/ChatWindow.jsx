import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { listMessages } from '../../services/chatService.js';

export default function ChatWindow({ conversationId, reloadToken, isTyping = false }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      if (!conversationId) {
        setMessages([]);
        return;
      }
      setLoading(true);
      try {
        const list = await listMessages(conversationId);
        if (!isCancelled) setMessages(list);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    load();
    return () => {
      isCancelled = true;
    };
  }, [conversationId, reloadToken]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change or typing state toggles
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="flex-1 min-h-0">
      <div ref={scrollRef} className="h-full overflow-y-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto w-full py-6 sm:py-8 space-y-4">
          {!conversationId ? (
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
              Select or create a conversation to get started.
            </div>
          ) : loading ? (
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
              Start a conversation by sending a message.
            </div>
          ) : (
            messages.map((m) => (
              <MessageBubble key={m.id} role={m.role}>
                {m.content}
              </MessageBubble>
            ))
          )}
          {isTyping ? <TypingIndicator /> : null}
        </div>
      </div>
    </div>
  );
}


