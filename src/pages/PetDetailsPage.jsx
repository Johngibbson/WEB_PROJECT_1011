import { Link, useParams } from 'react-router-dom';
import PetDetails from '../components/PetDetails.jsx';
import PetList from '../components/PetList.jsx';
import NotFound from '../components/NotFound.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// PetDetailsPage: reads the pet id from the URL (/pets/:id) and shows its profile plus related pets.
export default function PetDetailsPage() {
  const { id } = useParams();
  const { pets, getPetById } = useAppContext();
  const pet = getPetById(id);
  usePageTitle(pet ? `Meet ${pet.name}` : 'Pet not found');

  if (!pet) {
    return (
      <NotFound
        emoji="🐾"
        title="Pet not found"
        message="We couldn't find a pet with that ID. It may have been removed, or the link is incorrect."
      />
    );
  }

  // Up to 4 other pets of the same type.
  const relatedPets = pets.filter((item) => item.type === pet.type && item.id !== pet.id).slice(0, 4);

  return (
    <section className="page-section">
      <div className="container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Home</Link> <span aria-hidden="true">›</span> <Link to="/pets">Pets</Link>{' '}
          <span aria-hidden="true">›</span> <span aria-current="page">{pet.name}</span>
        </nav>

        {/* key resets the gallery when moving from one pet to another */}
        <PetDetails key={pet.id} pet={pet} />

        {relatedPets.length > 0 && (
          <section className="related" aria-labelledby="related-title">
            <h2 id="related-title" className="section-title">More {pet.type.toLowerCase()}s you might love</h2>
            <PetList pets={relatedPets} />
          </section>
        )}
      </div>
    </section>
  );
}
