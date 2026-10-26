import PetCard from './PetCard.jsx';
import { useAppContext } from '../context/AppContext.jsx';

// PetList: shows a responsive grid of PetCards for the pets passed in as a prop.
export default function PetList({ pets }) {
  const { isFavorite, toggleFavorite } = useAppContext();

  return (
    <ul className="pet-grid">
      {pets.map((pet, index) => (
        // The small animation delay makes cards fade in one after another.
        <li key={pet.id} className="fade-in" style={{ animationDelay: `${(index % 8) * 50}ms` }}>
          <PetCard pet={pet} isFavorite={isFavorite(pet.id)} onToggleFavorite={() => toggleFavorite(pet)} />
        </li>
      ))}
    </ul>
  );
}
