import PetList from '../components/PetList.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// FavoritesPage: /favorites. Shows the pets the user has hearted.
export default function FavoritesPage() {
  usePageTitle('Favourites');
  const { pets, favorites } = useAppContext();
  // Look up each saved ID; skip any that no longer exist.
  const favoritePets = pets.filter((pet) => favorites.includes(pet.id));

  return (
    <section className="page-section" aria-labelledby="favorites-title">
      <div className="container">
        <h1 id="favorites-title" className="page-title">Your Favourites</h1>
        {favoritePets.length === 0 ? (
          <EmptyState
            emoji="💔"
            title="No favourites yet"
            message="Tap the heart on any pet to save them here for later."
            actionLabel="Browse pets"
            actionTo="/pets"
          />
        ) : (
          <>
            <p className="section-intro">
              You have saved {favoritePets.length} {favoritePets.length === 1 ? 'pet' : 'pets'}.
            </p>
            <PetList pets={favoritePets} />
          </>
        )}
      </div>
    </section>
  );
}
