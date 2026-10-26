import StatusBadge from './StatusBadge.jsx';
import { formatDateTime } from '../utils/helpers.js';

// RequestDetails: every field of one adoption request plus its status history.
// Used inside the "View details" modal on the Requests and Admin pages.
export default function RequestDetails({ request }) {
  const history = Array.isArray(request.statusHistory) ? request.statusHistory : [];

  return (
    <div className="request-details">
      <dl className="details-list">
        <div><dt>Request ID</dt><dd><code>{request.id}</code></dd></div>
        <div><dt>Status</dt><dd><StatusBadge status={request.status} /></dd></div>
        <div><dt>Pet</dt><dd>{request.petName}</dd></div>
        <div><dt>Submitted</dt><dd>{formatDateTime(request.submittedAt)}</dd></div>
        <div><dt>Full name</dt><dd>{request.fullName}</dd></div>
        <div><dt>Email</dt><dd>{request.email}</dd></div>
        <div><dt>Phone</dt><dd>+91 {request.phone}</dd></div>
        <div><dt>Address</dt><dd>{request.address}</dd></div>
        <div><dt>Housing</dt><dd>{request.housing}</dd></div>
        <div><dt>Pet experience</dt><dd>{request.experience}{request.experienceDetails ? `: ${request.experienceDetails}` : ''}</dd></div>
        <div className="wide"><dt>Reason for adopting</dt><dd>{request.reason}</dd></div>
      </dl>

      <h3>Status history</h3>
      <ol className="history-list">
        {history.map((entry, index) => (
          <li key={`${entry.date}-${index}`}>
            <StatusBadge status={entry.status} />
            <span>{formatDateTime(entry.date)}</span>
            {entry.note && <span className="muted">{entry.note}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
