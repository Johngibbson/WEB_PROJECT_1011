import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PetFilters from '../components/PetFilters.jsx';
import PetList from '../components/PetList.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { AGE_GROUPS, filterPets, sortPets } from '../utils/helpers.js';

const PAGE_SIZE = 8;
const DEFAULT_SORT = 'name-asc';

// Friendly names for the filter chips.
const FILTER_LABELS = { q: 'Search', type: 'Type', age: 'Age', gender: 'Gender', status: 'Status' };

// Text shown on a chip, e.g. "Type: Dog" or "Age: Baby (under 1 year)".
function chipText(key, value) {
  if (key === 'age') {
    const group = AGE_GROUPS.find((item) => item.value === value);
    return `${FILTER_LABELS.age}: ${group ? group.label : value}`;
  }
  if (key === 'q') return `${FILTER_LABELS.q}: "${value}"`;
  return `${FILTER_LABELS[key]}: ${value}`;
}

// PetsPage: all pets with search, filters, sorting and "Load more".
// The filters live in the URL (e.g. #/pets?type=Dog&status=Available), so they survive refresh and can be shared.
export default function PetsPage() {
  usePageTitle('Available Pets');
  const { pets } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsKey = searchParams.toString();

  const filters = {
    q: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    age: searchParams.get('age') || '',
    gender: searchParams.get('gender') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || DEFAULT_SORT,
  };

  // The search box has its own state so typing feels instant; the URL is updated after a short pause.
  const [searchText, setSearchText] = useState(filters.q);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Sets (or removes, if empty) one query parameter in the URL.
  function updateParam(key, value) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value.trim() && !(key === 'sort' && value === DEFAULT_SORT)) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  }

  // The timer below runs 250 ms later, so it must call the newest updateParam
  // (an old one would write back an out-of-date URL). A ref always holds the latest version.
  const updateParamRef = useRef(updateParam);
  useEffect(() => {
    updateParamRef.current = updateParam;
  });

  // Debounce: wait 250 ms after the user stops typing before filtering.
  // (We only list searchText as a dependency because this should run only when the text changes.)
  useEffect(() => {
    if (searchText === filters.q) return undefined;
    const timer = setTimeout(() => updateParamRef.current('q', searchText), 250);
    return () => clearTimeout(timer);
  }, [searchText]);

  // If the URL search changes from outside (Clear all, chip removed, back button), update the box.
  useEffect(() => {
    setSearchText(filters.q);
  }, [filters.q]);

  // Go back to the first page of results whenever the filters change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [paramsKey]);

  const typeOptions = useMemo(() => [...new Set(pets.map((pet) => pet.type))].sort(), [pets]);

  const results = useMemo(
    () => sortPets(filterPets(pets, filters), filters.sort),
    // filters is rebuilt from the URL each render, so paramsKey (the URL query text) is the real dependency.
    [pets, paramsKey],
  );
  const visiblePets = results.slice(0, visibleCount);

  const activeFilters = ['q', 'type', 'age', 'gender', 'status'].filter((key) => filters[key]);

  // Removes every filter. The search box empties itself through the "sync" effect above.
  function clearAll() {
    setSearchParams({}, { replace: true });
  }

  return (
    <section className="page-section" aria-labelledby="pets-title">
      <div className="container">
        <h1 id="pets-title" className="page-title">Available Pets</h1>
        <p className="section-intro">Search and filter to find the friend who fits your home and lifestyle.</p>

        <PetFilters
          searchText={searchText}
          onSearchChange={setSearchText}
          filters={filters}
          onFilterChange={updateParam}
          typeOptions={typeOptions}
        />

        <div className="results-bar">
          <p className="results-count" aria-live="polite">
            Showing {results.length} of {pets.length} pets
          </p>
          {activeFilters.length > 0 && (
            <div className="chips">
              {activeFilters.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="chip"
                  aria-label={`Remove filter ${chipText(key, filters[key])}`}
                  onClick={() => updateParam(key, '')}
                >
                  {chipText(key, filters[key])} <span aria-hidden="true">×</span>
                </button>
              ))}
              <button type="button" className="btn-link" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState
            emoji="🙀"
            title="No pets match your search"
            message="Try removing a filter or searching for a different name or breed."
            actionLabel="Reset filters"
            onAction={clearAll}
          />
        ) : (
          <>
            <PetList pets={visiblePets} />
            {visibleCount < results.length && (
              <div className="center-box load-more">
                <button type="button" className="btn btn-primary" onClick={() => setVisibleCount(visibleCount + PAGE_SIZE)}>
                  Load more ({results.length - visibleCount} more)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
