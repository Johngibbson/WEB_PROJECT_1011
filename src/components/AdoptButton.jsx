import { Link } from 'react-router-dom';

// AdoptButton: a status-aware button.
// Available -> link to the adoption form. Pending / Adopted -> a disabled button explaining why.
export default function AdoptButton({ pet, label = 'Adopt Me' }) {
  if (pet.adoptionStatus === 'Available') {
    return (
      <Link to={`/adopt/${pet.id}`} className="btn btn-accent">
        {label}
      </Link>
    );
  }

  const disabledText = pet.adoptionStatus === 'Pending' ? 'Request Pending' : 'Already Adopted';
  return (
    <button type="button" className="btn btn-disabled" disabled>
      {disabledText}
    </button>
  );
}
