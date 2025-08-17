
import { useEffect, useMemo, useState } from 'react';
import ChatWindow from '../components/Chat/ChatWindow.jsx';
import Composer from '../components/Chat/Composer.jsx';
import ConversationList from '../components/Chat/ConversationList.jsx';
import ChatLayout from '../components/Chat/ChatLayout.jsx';
import { createConversation, createMessage, listConversations } from '../services/chatService.js';


export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function load() {
      const list = await listConversations();
      setConversations(list);
      if (list.length && !activeConversationId) {
        setActiveConversationId(list[0].id);
      }
    }
    load();
  }, []);

  const sidebar = useMemo(() => (
    <ConversationList
      conversations={conversations}
      activeId={activeConversationId}
      onSelect={setActiveConversationId}
      onNewConversation={async () => {
        const created = await createConversation({ title: 'New conversation' });
        const list = await listConversations();
        setConversations(list);
        setActiveConversationId(created.id);
      }}
    />
  ), [conversations, activeConversationId]);

  const handleSend = async (text) => {
    if (!activeConversationId) return;
    await createMessage({ conversationId: activeConversationId, role: 'user', content: text });
    setReloadToken((n) => n + 1);
    setIsTyping(true);
    // mock assistant reply
    setTimeout(async () => {
      await createMessage({ conversationId: activeConversationId, role: 'assistant', content: `You said: ${text}` });
      setIsTyping(false);
      setReloadToken((n) => n + 1);
    }, 700);
  };

  return (
    <ChatLayout sidebarContent={sidebar}>
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ChatWindow conversationId={activeConversationId} reloadToken={reloadToken} isTyping={isTyping} />
        </div>
        <div className="mt-2">
          <Composer
            onSend={handleSend}
            onAttachImage={(file) => {
              console.log('Selected image (mock):', file?.name);
            }}
            onStartVoice={() => {
              setIsTyping(true);
              setTimeout(async () => {
                const fakeTranscript = 'This is a mock voice transcription.';
                setIsTyping(false);
                await handleSend(fakeTranscript);
              }, 800);
            }}
            onStopVoice={() => {
              // no-op placeholder
            }}
          />
        </div>
      </div>
    </ChatLayout>
  );
}

