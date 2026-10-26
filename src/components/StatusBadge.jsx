const STATUS_ICONS = {
  Available: '●',
  Pending: '◷',
  Adopted: '♥',
  Approved: '✔',
  Rejected: '✖',
  Cancelled: '–',
};

// StatusBadge: a coloured pill showing a pet or request status.
// The CSS class (e.g. "status-pending") picks the colour.
export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      <span aria-hidden="true">{STATUS_ICONS[status] || '●'}</span> {status}
    </span>
  );
}
