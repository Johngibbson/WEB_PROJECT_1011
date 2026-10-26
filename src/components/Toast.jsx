import { useAppContext } from '../context/AppContext.jsx';

// Toast: shows small pop-up messages in the corner.
// aria-live="polite" makes screen readers announce each new message.
export default function Toast() {
  const { toasts, dismissToast } = useAppContext();

  return (
    <div className="toast-container" aria-live="polite" role="status">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span aria-hidden="true">{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <p>{toast.message}</p>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
