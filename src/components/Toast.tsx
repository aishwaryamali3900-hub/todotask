import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  const toneStyles = {
    success: {
      container: 'border-[#A7F3D0] bg-[#FFFFFF]',
      icon: <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" aria-hidden="true" />,
      text: 'text-[#0F172A]',
    },
    info: {
      container: 'border-[#E2E8F0] bg-[#FFFFFF]',
      icon: <Info className="h-4 w-4 text-[#4F46E5] shrink-0" aria-hidden="true" />,
      text: 'text-[#0F172A]',
    },
    danger: {
      container: 'border-[#FECDD3] bg-[#FFFFFF]',
      icon: <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" aria-hidden="true" />,
      text: 'text-[#0F172A]',
    },
  }[toast.tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-clarity-3 transition-all duration-150 ${toneStyles.container}`}
    >
      {toneStyles.icon}
      <span className={`text-sm font-medium ${toneStyles.text}`}>{toast.message}</span>
      {toast.undoAction && (
        <button
          type="button"
          onClick={() => {
            toast.undoAction?.();
            onDismiss();
          }}
          className="ml-1 rounded-md px-2 py-1 text-xs font-semibold text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors whitespace-nowrap shrink-0"
        >
          Undo
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
