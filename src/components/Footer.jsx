import { Link } from 'react-router-dom';

// Footer: contact details, quick links and copyright line.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h2 className="footer-title">🐾 Pawfect Match</h2>
          <p>Connecting rescued pets with loving families across India since 2019.</p>
        </section>

        <section>
          <h2 className="footer-title">Quick Links</h2>
          <ul className="footer-links">
            <li><Link to="/pets">Available Pets</Link></li>
            <li><Link to="/requests">My Adoption Requests</Link></li>
            <li><Link to="/favorites">Favourites</Link></li>
            <li><Link to="/about">How It Works</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="footer-title">Contact</h2>
          <address className="footer-address">
            12, Lake View Road, T. Nagar, Chennai 600017
            <br />
            Phone: +91 98765 43210
            <br />
            Email: hello@pawfectmatch.in
            <br />
            Mon to Sat, 10:00 am to 6:00 pm
          </address>
        </section>
      </div>

      <p className="footer-bottom">
        © {year} Pawfect Match. A Web Technology college project. All pets shown are sample data.
      </p>
    </footer>
  );
}
