import Modal from './Modal.jsx';

// ConfirmDialog: a small "Are you sure?" modal with Cancel and Confirm buttons.
export default function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            No, go back
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
