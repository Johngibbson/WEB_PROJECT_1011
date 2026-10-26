import { useEffect, useId, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Modal: an accessible pop-up dialog.
// Esc closes it, clicking the dark background closes it, Tab stays inside it (focus trap),
// and focus returns to the button that opened it when it closes.
export default function Modal({ isOpen, title, onClose, children, footer }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  // Always keep the latest onClose in a ref, so the effect below does not re-run on every render.
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    const firstFocusable = dialog.querySelector(FOCUSABLE);
    if (firstFocusable) firstFocusable.focus();
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      // Focus trap: wrap from last element to first and from first to last.
      const items = dialog.querySelectorAll(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Close only when the click is on the dark overlay itself, not inside the dialog box.
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
