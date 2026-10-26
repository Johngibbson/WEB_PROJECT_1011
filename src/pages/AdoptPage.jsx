import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdoptionForm from '../components/AdoptionForm.jsx';
import AdoptionSuccess from '../components/AdoptionSuccess.jsx';
import NotFound from '../components/NotFound.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// AdoptPage: /adopt/:id. Shows the form for an Available pet, a blocked message
// for Pending / Adopted pets, and the success screen after submitting.
export default function AdoptPage() {
  const { id } = useParams();
  const { getPetById } = useAppContext();
  const pet = getPetById(id);
  // Stored here (not in the form) because submitting changes the pet to Pending,
  // and we still want to show the success screen instead of the "not available" message.
  const [submittedRequest, setSubmittedRequest] = useState(null);
  usePageTitle(pet ? `Adopt ${pet.name}` : 'Adoption request');

  if (submittedRequest) {
    return <AdoptionSuccess request={submittedRequest} />;
  }

  if (!pet) {
    return <NotFound emoji="🐾" title="Pet not found" message="We couldn't find the pet you want to adopt." />;
  }

  if (pet.adoptionStatus !== 'Available') {
    return (
      <section className="container page-section center-box" aria-labelledby="blocked-title">
        <p className="big-emoji" aria-hidden="true">{pet.adoptionStatus === 'Adopted' ? '🏡' : '⏳'}</p>
        <h1 id="blocked-title">{pet.name} can&apos;t be adopted right now</h1>
        <p>
          Current status: <StatusBadge status={pet.adoptionStatus} />
        </p>
        <p>
          {pet.adoptionStatus === 'Adopted'
            ? `${pet.name} has already found a forever home.`
            : `${pet.name} already has an adoption request under review. If it is not approved, ${pet.name} will be available again.`}
        </p>
        <div className="button-row center">
          <Link to="/pets?status=Available" className="btn btn-primary">See available pets</Link>
          <Link to={`/pets/${pet.id}`} className="btn btn-outline">Back to {pet.name}&apos;s profile</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section" aria-labelledby="adopt-title">
      <div className="container narrow">
        <Link to={`/pets/${pet.id}`} className="back-link">← Back to {pet.name}&apos;s profile</Link>
        <h1 id="adopt-title" className="page-title">Adoption Request</h1>
        <p className="section-intro">Fields marked * are required. It takes about 3 minutes.</p>
        <AdoptionForm pet={pet} onSuccess={setSubmittedRequest} />
      </div>
    </section>
  );
}
