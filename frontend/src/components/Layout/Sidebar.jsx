import { useEffect } from 'react';

export default function Sidebar({ open, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sm:hidden fixed inset-0 bg-black/40 z-30 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Sidebar panel */}
      <aside
        className={`sm:static fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform sm:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar"
      >
        <div className="h-14 sm:hidden flex items-center px-3 border-b border-slate-200 dark:border-slate-800">
          <button
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {children ? (
            children
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400 px-2 py-2">No sidebar content</div>
          )}
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button className="w-full justify-center inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}


