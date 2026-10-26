import { useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection.jsx';
import PetList from '../components/PetList.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import CountUp from '../components/CountUp.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import testimonials from '../data/testimonials.js';

// Adoptions and families helped before this website existed (sample numbers).
const PAST_ADOPTIONS = 248;
const PAST_FAMILIES = 231;

const HOME_STEPS = [
  { icon: '🔍', title: 'Browse', text: 'Explore pet profiles and filter by type, age and gender to find your match.' },
  { icon: '📝', title: 'Apply', text: 'Send a short adoption request. You get a request ID to track its status.' },
  { icon: '🏡', title: 'Meet and Adopt', text: 'Meet your new friend, complete the paperwork and welcome them home.' },
];

// Scrolls smoothly to a section and moves keyboard focus there too.
function scrollToSection(sectionRef) {
  const section = sectionRef.current;
  if (!section) return;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  section.focus({ preventScroll: true });
}

// HomePage: hero, featured pets, how-it-works steps, live statistics and testimonials.
export default function HomePage() {
  usePageTitle('Home');
  const { pets, requests } = useAppContext();
  const featuredRef = useRef(null);
  const stepsRef = useRef(null);

  const availablePets = pets.filter((pet) => pet.adoptionStatus === 'Available');
  const featuredPets = availablePets.slice(0, 4);

  // Statistics are calculated from the real data, so they change as requests are approved.
  const approvedRequests = requests.filter((request) => request.status === 'Approved');
  const approvedFamilies = new Set(approvedRequests.map((request) => request.email)).size;
  const stats = [
    { label: 'Pets available now', value: availablePets.length, icon: '🐾' },
    { label: 'Successful adoptions', value: PAST_ADOPTIONS + approvedRequests.length, icon: '🏆' },
    { label: 'Happy families', value: PAST_FAMILIES + approvedFamilies, icon: '👨‍👩‍👧' },
  ];

  return (
    <>
      <HeroSection
        onExploreClick={() => scrollToSection(featuredRef)}
        onHowItWorksClick={() => scrollToSection(stepsRef)}
      />

      <section className="page-section" ref={featuredRef} tabIndex={-1} aria-labelledby="featured-title">
        <div className="container">
          <div className="section-header">
            <h2 id="featured-title" className="section-title">Featured pets</h2>
            <Link to="/pets" className="btn btn-outline">See all pets →</Link>
          </div>
          {featuredPets.length > 0 ? (
            <PetList pets={featuredPets} />
          ) : (
            <EmptyState
              emoji="🏡"
              title="Every pet has found a home!"
              message="Check back soon for new friends."
              actionLabel="View all pets"
              actionTo="/pets"
            />
          )}
        </div>
      </section>

      <div ref={stepsRef} tabIndex={-1}>
        <HowItWorks id="home-steps" title="How adoption works" intro="Three simple steps to your forever friend." steps={HOME_STEPS} />
      </div>

      <section className="page-section stats-section" aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className="section-title">Our impact</h2>
          <ul className="stats-grid">
            {stats.map((stat) => (
              <li key={stat.label} className="stat-card">
                <span className="stat-icon" aria-hidden="true">{stat.icon}</span>
                <span className="stat-number"><CountUp end={stat.value} /></span>
                <span className="stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section" aria-labelledby="testimonials-title">
        <div className="container">
          <h2 id="testimonials-title" className="section-title">Happy tails</h2>
          <ul className="testimonial-grid">
            {testimonials.map((item) => (
              <li key={item.id}>
                <figure className="card testimonial">
                  <blockquote>“{item.quote}”</blockquote>
                  <figcaption>
                    <strong>{item.name}</strong>, {item.city}
                    <span className="muted"> · adopted {item.pet}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section cta-section">
        <div className="container center-box">
          <h2>Ready to meet your new best friend?</h2>
          <p>Dozens of rescued pets are waiting. Start browsing today.</p>
          <Link to="/pets" className="btn btn-accent btn-lg">Adopt a Pet</Link>
        </div>
      </section>
    </>
  );
}
