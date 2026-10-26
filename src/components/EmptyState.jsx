import { Link } from 'react-router-dom';

// EmptyState: friendly message shown when a list has nothing to display.
// Give it either actionTo (a link) or onAction (a button click handler).
export default function EmptyState({ emoji = '🐾', title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="empty-state">
      <p className="big-emoji" aria-hidden="true">{emoji}</p>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>
      )}
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
