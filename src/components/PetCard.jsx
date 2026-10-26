import { Link } from 'react-router-dom';
import PetImage from './PetImage.jsx';
import StatusBadge from './StatusBadge.jsx';
import AdoptButton from './AdoptButton.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { formatAge } from '../utils/helpers.js';

// PetCard: a summary card for one pet.
// Props: pet (the pet object), isFavorite (true/false), onToggleFavorite (function).
export default function PetCard({ pet, isFavorite, onToggleFavorite }) {
  return (
    <article className="pet-card">
      <div className="pet-card-image">
        {/* tabIndex -1: keyboard users reach the same page through the name link, so we skip this one */}
        <Link to={`/pets/${pet.id}`} tabIndex={-1}>
          <PetImage src={pet.image} alt={`Photo of ${pet.name}, a ${pet.breed}`} />
        </Link>
        <div className="pet-card-status">
          <StatusBadge status={pet.adoptionStatus} />
        </div>
        <div className="pet-card-favorite">
          <FavoriteButton petName={pet.name} isFavorite={isFavorite} onToggle={onToggleFavorite} />
        </div>
      </div>

      <div className="pet-card-body">
        <h3 className="pet-card-title">
          <Link to={`/pets/${pet.id}`}>{pet.name}</Link>
        </h3>
        <p className="pet-card-breed">{pet.breed}</p>
        <ul className="pet-meta" aria-label={`${pet.name}'s details`}>
          <li>{pet.type}</li>
          <li>{formatAge(pet.age)}</li>
          <li>{pet.gender}</li>
          <li>📍 {pet.location}</li>
        </ul>
        <div className="pet-card-actions">
          <Link to={`/pets/${pet.id}`} className="btn btn-outline">
            View Details
          </Link>
          <AdoptButton pet={pet} />
        </div>
      </div>
    </article>
  );
}
