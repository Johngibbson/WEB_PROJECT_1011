import { useState } from 'react';
import { Link } from 'react-router-dom';
import PetImage from './PetImage.jsx';
import StatusBadge from './StatusBadge.jsx';
import AdoptButton from './AdoptButton.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { copyText, formatAge } from '../utils/helpers.js';

const HEALTH_ITEMS = [
  { key: 'vaccinated', label: 'Vaccinated' },
  { key: 'neutered', label: 'Neutered / Spayed' },
  { key: 'dewormed', label: 'Dewormed' },
  { key: 'microchipped', label: 'Microchipped' },
];

// PetDetails: the full profile of one pet (photos, facts, health, personality, care needs).
// Props: pet (the pet object to show).
export default function PetDetails({ pet }) {
  const { isFavorite, toggleFavorite, showToast } = useAppContext();
  const images = pet.gallery && pet.gallery.length > 0 ? pet.gallery : [pet.image];
  const [activeImage, setActiveImage] = useState(images[0]);
  const health = pet.health || {};

  // Uses the phone's share sheet if there is one; otherwise copies the page link.
  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Adopt ${pet.name}`, text: `Meet ${pet.name}, looking for a home!`, url });
      } catch {
        // The user closed the share sheet; nothing to do.
      }
      return;
    }
    const copied = await copyText(url);
    showToast(copied ? 'Link copied to clipboard.' : 'Could not copy the link.', copied ? 'success' : 'error');
  }

  return (
    <article className="pet-details">
      <div className="pet-gallery">
        {/* key makes React create a fresh <img> when the photo changes, so the fallback works for each one */}
        <PetImage key={activeImage} src={activeImage} alt={`Photo of ${pet.name}`} className="pet-main-image" lazy={false} />
        {images.length > 1 && (
          <div className="thumbnails" role="group" aria-label="More photos">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={image === activeImage ? 'thumbnail active' : 'thumbnail'}
                aria-label={`Show photo ${index + 1} of ${images.length}`}
                aria-pressed={image === activeImage}
                onClick={() => setActiveImage(image)}
              >
                <PetImage src={image} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pet-info">
        <div className="pet-info-header">
          <h1>{pet.name}</h1>
          <StatusBadge status={pet.adoptionStatus} />
        </div>
        <p className="pet-breed-line">{pet.breed}</p>

        <dl className="facts-grid">
          <div><dt>Type</dt><dd>{pet.type}</dd></div>
          <div><dt>Age</dt><dd>{formatAge(pet.age)}</dd></div>
          <div><dt>Gender</dt><dd>{pet.gender}</dd></div>
          <div><dt>Location</dt><dd>📍 {pet.location}</dd></div>
        </dl>

        <p className="pet-description">{pet.description}</p>

        <div className="button-row">
          <AdoptButton pet={pet} label="Apply for Adoption" />
          <FavoriteButton
            petName={pet.name}
            isFavorite={isFavorite(pet.id)}
            onToggle={() => toggleFavorite(pet)}
            showLabel
          />
          <button type="button" className="btn btn-outline" onClick={handleShare}>
            🔗 Share
          </button>
        </div>
        {pet.adoptionStatus !== 'Available' && (
          <p className="note">
            {pet.adoptionStatus === 'Pending'
              ? `${pet.name} already has an adoption request under review.`
              : `${pet.name} has found a forever home.`}{' '}
            <Link to="/pets?status=Available">See pets that are available</Link>.
          </p>
        )}

        <section className="info-block" aria-labelledby="health-title">
          <h2 id="health-title">Health &amp; vaccination</h2>
          <ul className="health-list">
            {HEALTH_ITEMS.map((item) => (
              <li key={item.key} className={health[item.key] ? 'yes' : 'no'}>
                <span aria-hidden="true">{health[item.key] ? '✅' : '⬜'}</span>
                {item.label}
                <span className="visually-hidden">{health[item.key] ? ': yes' : ': not yet'}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="info-block" aria-labelledby="personality-title">
          <h2 id="personality-title">Personality</h2>
          <ul className="tag-list">
            {(pet.personality || []).map((tag) => (
              <li key={tag} className="tag">{tag}</li>
            ))}
          </ul>
        </section>

        <section className="info-block" aria-labelledby="care-title">
          <h2 id="care-title">Care needs</h2>
          <p>{pet.careNeeds}</p>
        </section>
      </div>
    </article>
  );
}
