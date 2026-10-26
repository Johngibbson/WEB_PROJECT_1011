import StatusBadge from './StatusBadge.jsx';
import { formatDate } from '../utils/helpers.js';

// AdoptionRequests: a table of requests. On phones, CSS turns each row into a card
// (the data-label attribute supplies the small heading shown on each line).
// Props: requests, onView(request), and renderActions(request) for extra buttons per row.
export default function AdoptionRequests({ requests, onView, renderActions }) {
  return (
    <div className="table-wrapper">
      <table className="responsive-table">
        <caption className="visually-hidden">Adoption requests</caption>
        <thead>
          <tr>
            <th scope="col">Request ID</th>
            <th scope="col">Applicant</th>
            <th scope="col">Pet</th>
            <th scope="col">Submitted</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td data-label="Request ID"><code>{request.id}</code></td>
              <td data-label="Applicant">
                <span className="cell-main">{request.fullName}</span>
                <span className="cell-sub">{request.email}</span>
              </td>
              <td data-label="Pet">{request.petName}</td>
              <td data-label="Submitted">{formatDate(request.submittedAt)}</td>
              <td data-label="Status"><StatusBadge status={request.status} /></td>
              <td data-label="Actions">
                <div className="row-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => onView(request)}>
                    View details
                  </button>
                  {renderActions && renderActions(request)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
