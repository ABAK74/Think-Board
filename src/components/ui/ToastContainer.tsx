import React from 'react';
import { ToastMessage } from '../../types/note';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border text-xs sm:text-sm font-medium transition-all ${
            t.type === 'success'
              ? 'bg-[#13261f] border-emerald-500/40 text-emerald-200'
              : t.type === 'error'
              ? 'bg-[#2a1619] border-red-500/40 text-red-200'
              : 'bg-[#1a2030] border-indigo-500/40 text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {t.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            {t.type === 'info' && (
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span>{t.message}</span>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
