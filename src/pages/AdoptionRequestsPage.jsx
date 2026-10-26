import { useMemo, useState } from 'react';
import AdoptionRequests from '../components/AdoptionRequests.jsx';
import RequestDetails from '../components/RequestDetails.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { REQUEST_STATUSES } from '../utils/helpers.js';

// AdoptionRequestsPage: lists the requests sent from this browser, with search,
// status filter, date sort, a details modal and a cancel option for Pending requests.
export default function AdoptionRequestsPage() {
  usePageTitle('My Adoption Requests');
  const { requests, cancelRequest } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [viewingId, setViewingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const filteredRequests = useMemo(() => {
    const text = search.trim().toLowerCase();
    const list = requests.filter((request) => {
      const matchesText =
        !text || request.fullName.toLowerCase().includes(text) || request.petName.toLowerCase().includes(text);
      const matchesStatus = !statusFilter || request.status === statusFilter;
      return matchesText && matchesStatus;
    });
    return list.sort((a, b) => {
      const difference = new Date(b.submittedAt) - new Date(a.submittedAt);
      return sortOrder === 'newest' ? difference : -difference;
    });
  }, [requests, search, statusFilter, sortOrder]);

  const viewingRequest = requests.find((request) => request.id === viewingId);
  const cancellingRequest = requests.find((request) => request.id === cancellingId);

  function handleConfirmCancel() {
    cancelRequest(cancellingId);
    setCancellingId(null);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('');
  }

  // Extra button on each row: Cancel, only while the request is Pending.
  function renderActions(request) {
    if (request.status !== 'Pending') return null;
    return (
      <button type="button" className="btn btn-danger btn-sm" onClick={() => setCancellingId(request.id)}>
        Cancel request
      </button>
    );
  }

  return (
    <section className="page-section" aria-labelledby="requests-title">
      <div className="container">
        <h1 id="requests-title" className="page-title">My Adoption Requests</h1>
        <p className="section-intro">Track the status of the requests you have sent from this browser.</p>

        {requests.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="You haven't sent any requests yet"
            message="Find a pet you love and click “Adopt Me” to send your first request."
            actionLabel="Browse pets"
            actionTo="/pets"
          />
        ) : (
          <>
            <div className="toolbar">
              <div className="form-group">
                <label htmlFor="request-search">Search applicant or pet</label>
                <input id="request-search" type="search" value={search} maxLength={60} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="request-status">Status</label>
                <select id="request-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="">All statuses</option>
                  {REQUEST_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="request-sort">Sort by date</label>
                <select id="request-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>

            <p className="results-count" aria-live="polite">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>

            {filteredRequests.length === 0 ? (
              <EmptyState emoji="🔍" title="No requests match" message="Try a different search or status." actionLabel="Clear filters" onAction={clearFilters} />
            ) : (
              <AdoptionRequests
                requests={filteredRequests}
                onView={(request) => setViewingId(request.id)}
                renderActions={renderActions}
              />
            )}
          </>
        )}

        <Modal isOpen={Boolean(viewingRequest)} title="Request details" onClose={() => setViewingId(null)}>
          {viewingRequest && <RequestDetails request={viewingRequest} />}
        </Modal>

        <ConfirmDialog
          isOpen={Boolean(cancellingRequest)}
          title="Cancel this request?"
          message={
            cancellingRequest
              ? `Your request ${cancellingRequest.id} to adopt ${cancellingRequest.petName} will be cancelled and ${cancellingRequest.petName} will be available to other families.`
              : ''
          }
          confirmLabel="Yes, cancel request"
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancellingId(null)}
        />
      </div>
    </section>
  );
}
