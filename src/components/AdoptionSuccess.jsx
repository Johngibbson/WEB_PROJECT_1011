import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { copyText } from '../utils/helpers.js';

// AdoptionSuccess: thank-you screen shown after a request is submitted.
// Props: request (the saved request object).
export default function AdoptionSuccess({ request }) {
  const { showToast } = useAppContext();

  async function handleCopy() {
    const copied = await copyText(request.id);
    showToast(copied ? 'Request ID copied.' : 'Could not copy the ID.', copied ? 'success' : 'error');
  }

  return (
    <section className="container page-section center-box success-box" aria-labelledby="success-title">
      <p className="big-emoji" aria-hidden="true">🎉</p>
      <h1 id="success-title">Request submitted!</h1>
      <p>
        Thank you, {request.fullName}. Your request to adopt <strong>{request.petName}</strong> is now{' '}
        <strong>Pending</strong>. Our team will contact you at {request.email} within 2 to 3 working days.
      </p>

      <div className="request-id-box">
        <span className="muted">Your request ID</span>
        <code>{request.id}</code>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleCopy}>
          📋 Copy ID
        </button>
      </div>

      <div className="button-row center">
        <Link to="/requests" className="btn btn-primary">View my requests</Link>
        <Link to="/pets" className="btn btn-outline">Browse more pets</Link>
      </div>
    </section>
  );
}
