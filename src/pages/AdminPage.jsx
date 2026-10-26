import AdminDashboard from '../components/AdminDashboard.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// AdminPage: /admin. A clear "demo only" banner above the admin dashboard.
export default function AdminPage() {
  usePageTitle('Admin Dashboard');

  return (
    <section className="page-section" aria-labelledby="admin-title">
      <div className="container">
        <div className="demo-banner" role="note">
          <strong>Demo only:</strong> this admin panel is a frontend demonstration. It has no login or server,
          and it is not secure real-world administration.
        </div>
        <h1 id="admin-title" className="page-title">Admin Dashboard</h1>
        <p className="section-intro">Review adoption requests. Approving a request marks the pet as Adopted.</p>
        <AdminDashboard />
      </div>
    </section>
  );
}
