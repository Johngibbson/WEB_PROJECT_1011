import { Link } from 'react-router-dom';
import PetImage from './PetImage.jsx';

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/pets/hero.jpg`;

// HeroSection: the big welcome banner on the Home page.
// The two scroll buttons call functions passed in as props by the Home page.
export default function HeroSection({ onExploreClick, onHowItWorksClick }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-text">
          <p className="eyebrow">Adopt, don&apos;t shop 🐶🐱🐰</p>
          <h1 id="hero-title">Find Your Forever Friend</h1>
          <p className="hero-lead">
            Every pet here has been rescued, health-checked and is waiting for a loving home.
            Browse their profiles, fall in love, and send an adoption request in minutes.
          </p>
          <div className="hero-buttons">
            <Link to="/pets" className="btn btn-accent btn-lg">Adopt a Pet</Link>
            <button type="button" className="btn btn-primary btn-lg" onClick={onExploreClick}>
              Explore Pets
            </button>
            <button type="button" className="btn btn-outline btn-lg" onClick={onHowItWorksClick}>
              How Adoption Works
            </button>
          </div>
        </div>
        <div className="hero-image">
          <PetImage src={HERO_IMAGE} alt="A black dog and a white dog playing together on the grass" lazy={false} />
        </div>
      </div>
    </section>
  );
}
