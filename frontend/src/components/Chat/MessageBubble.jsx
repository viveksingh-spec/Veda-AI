export default function MessageBubble({ role = 'assistant', children }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

