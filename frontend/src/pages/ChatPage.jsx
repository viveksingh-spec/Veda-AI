
import ChatWindow from '../components/Chat/ChatWindow.jsx';
import Composer from '../components/Chat/Composer.jsx';


export default function ChatPage() {
  const handleSend = (text) => {
    // F03 scaffolding only: no real send; console log to visualize
    console.log('Send:', text);
  };

  return (
   
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Scrollable message area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatWindow />
      </div>

      {/* Composer pinned at bottom */}
      <div className="mt-2">
        <Composer onSend={handleSend} />
      </div>
    </div>
  );
}

