import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '../../hooks/useToast';

const icons = {
  success: <CheckCircle size={16} className="text-success shrink-0" />,
  error: <XCircle size={16} className="text-error shrink-0" />,
  warning: <AlertCircle size={16} className="text-warning shrink-0" />,
  info: <Info size={16} className="text-info shrink-0" />,
};

const borders = {
  success: 'border-success/30',
  error: 'border-error/30',
  warning: 'border-warning/30',
  info: 'border-info/30',
};

interface ToastItemProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  return (
    <div className={`animate-slide-up flex items-start gap-3 rounded-xl border ${borders[toast.type]} bg-surface-2 px-4 py-3 shadow-xl shadow-black/50 min-w-64 max-w-sm`}>
      {icons[toast.type]}
      <p className="text-sm text-text flex-1 leading-relaxed">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-text-dim hover:text-text transition-colors shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
