import { useMemo, useState } from 'react';
import AdoptionRequests from './AdoptionRequests.jsx';
import RequestDetails from './RequestDetails.jsx';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import EmptyState from './EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { REQUEST_STATUSES, downloadRequestsCSV } from '../utils/helpers.js';

// AdminDashboard: demo admin tools. Summary cards, a searchable list of all requests
// with Approve / Reject buttons, CSV export and a reset button.
export default function AdminDashboard() {
  const { requests, approveRequest, rejectRequest, resetDemoData } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewingId, setViewingId] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Count requests in each status for the summary cards.
  const summary = useMemo(() => {
    const counts = { total: requests.length, Pending: 0, Approved: 0, Rejected: 0 };
    requests.forEach((request) => {
      if (counts[request.status] !== undefined) counts[request.status] += 1;
    });
    return counts;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const text = search.trim().toLowerCase();
    return requests
      .filter((request) => !statusFilter || request.status === statusFilter)
      .filter(
        (request) =>
          !text ||
          request.fullName.toLowerCase().includes(text) ||
          request.petName.toLowerCase().includes(text) ||
          request.id.toLowerCase().includes(text),
      )
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [requests, search, statusFilter]);

  // Looked up by id so the modal always shows the latest status.
  const viewingRequest = requests.find((request) => request.id === viewingId);

  function handleReset() {
    resetDemoData();
    setConfirmReset(false);
    setViewingId(null);
  }

  // Approve / Reject buttons, shown only for Pending requests.
  function renderActions(request) {
    if (request.status !== 'Pending') return null;
    return (
      <>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => approveRequest(request.id)}>
          Approve
        </button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => rejectRequest(request.id)}>
          Reject
        </button>
      </>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="summary-grid">
        <div className="summary-card"><span className="summary-number">{summary.total}</span><span>Total requests</span></div>
        <div className="summary-card pending"><span className="summary-number">{summary.Pending}</span><span>Pending</span></div>
        <div className="summary-card approved"><span className="summary-number">{summary.Approved}</span><span>Approved</span></div>
        <div className="summary-card rejected"><span className="summary-number">{summary.Rejected}</span><span>Rejected</span></div>
      </div>

      <div className="toolbar">
        <div className="form-group">
          <label htmlFor="admin-search">Search applicant, pet or ID</label>
          <input id="admin-search" type="search" value={search} maxLength={60} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="admin-status">Status</label>
          <select id="admin-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {REQUEST_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="toolbar-buttons">
          <button
            type="button"
            className="btn btn-outline"
            disabled={requests.length === 0}
            onClick={() => downloadRequestsCSV(requests)}
          >
            ⬇ Export CSV
          </button>
          <button type="button" className="btn btn-danger" onClick={() => setConfirmReset(true)}>
            Reset demo data
          </button>
        </div>
      </div>

      <p className="results-count" aria-live="polite">
        Showing {filteredRequests.length} of {requests.length} requests
      </p>

      {requests.length === 0 && (
        <EmptyState
          emoji="📭"
          title="No adoption requests yet"
          message="Submit a request from any available pet's page, then come back here to approve or reject it."
          actionLabel="Browse pets"
          actionTo="/pets"
        />
      )}
      {requests.length > 0 && filteredRequests.length === 0 && (
        <EmptyState
          emoji="🔍"
          title="No requests match"
          message="Try a different search or status."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('');
          }}
        />
      )}
      {filteredRequests.length > 0 && (
        <AdoptionRequests
          requests={filteredRequests}
          onView={(request) => setViewingId(request.id)}
          renderActions={renderActions}
        />
      )}

      <Modal isOpen={Boolean(viewingRequest)} title="Request details" onClose={() => setViewingId(null)}>
        {viewingRequest && <RequestDetails request={viewingRequest} />}
      </Modal>

      <ConfirmDialog
        isOpen={confirmReset}
        title="Reset demo data?"
        message="This restores the 12 sample pets to their original status and deletes every adoption request. Favourites are kept. This cannot be undone."
        confirmLabel="Yes, reset everything"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
