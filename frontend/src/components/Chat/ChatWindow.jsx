export default function ChatWindow() {
  return (
    
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto w-full py-6 sm:py-8 space-y-4">
          {/* Placeholder message list */}
          {Array.from({ length: 15}).map((_, i) => (
            <div key={i} className="flex">
              <div className="rounded-lg px-4 py-3 shadow bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                Placeholder message {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    
  );
}


