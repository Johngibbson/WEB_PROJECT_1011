import { Link } from 'react-router-dom';

// NotFound: reusable "we couldn't find that" message with links home and to the pets list.
export default function NotFound({ emoji = '🐕', title = 'Page not found', message }) {
  return (
    <section className="container page-section center-box">
      <p className="big-emoji" aria-hidden="true">{emoji}</p>
      <h1>{title}</h1>
      <p>{message || 'Looks like this page wandered off. Let’s get you back on track.'}</p>
      <div className="button-row center">
        <Link to="/" className="btn btn-primary">Go to Home</Link>
        <Link to="/pets" className="btn btn-outline">Browse Pets</Link>
      </div>
    </section>
  );
}
