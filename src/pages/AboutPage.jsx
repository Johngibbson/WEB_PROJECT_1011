import { Link } from 'react-router-dom';
import AboutSection from '../components/AboutSection.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// AboutPage: /about. Page heading plus the AboutSection content.
export default function AboutPage() {
  usePageTitle('About Us');

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>About Us &amp; How It Works</h1>
          <p>Rescue, care, and responsible adoption across India.</p>
        </div>
      </section>
      <AboutSection />
      <section className="page-section cta-section">
        <div className="container center-box">
          <h2>Feel ready to adopt?</h2>
          <div className="button-row center">
            <Link to="/pets" className="btn btn-accent">Browse pets</Link>
            <Link to="/contact" className="btn btn-outline">Ask us a question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
