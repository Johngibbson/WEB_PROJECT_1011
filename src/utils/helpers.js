// Small helper functions used across the app.

// Path to the local fallback image (works in dev and after deployment).
export const PLACEHOLDER_IMAGE = `${import.meta.env.BASE_URL}images/placeholder.svg`;

export const PET_STATUSES = ['Available', 'Pending', 'Adopted'];
export const REQUEST_STATUSES = ['Pending', 'Approved', 'Rejected', 'Cancelled'];

// Age groups used by the filter. min is inclusive, max is exclusive.
export const AGE_GROUPS = [
  { value: 'baby', label: 'Baby (under 1 year)', min: 0, max: 1 },
  { value: 'young', label: 'Young (1 to 3 years)', min: 1, max: 3 },
  { value: 'adult', label: 'Adult (3 to 8 years)', min: 3, max: 8 },
  { value: 'senior', label: 'Senior (8+ years)', min: 8, max: Infinity },
];

export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
  { value: 'age-asc', label: 'Age (youngest first)' },
  { value: 'age-desc', label: 'Age (oldest first)' },
];

// Turns an age in years into friendly text: 0.5 -> "6 months", 2 -> "2 years", 1.5 -> "1 year 6 months".
export function formatAge(age) {
  const years = Math.floor(age);
  const months = Math.round((age - years) * 12);
  const monthText = months === 1 ? '1 month' : `${months} months`;
  const yearText = years === 1 ? '1 year' : `${years} years`;

  if (years === 0) return monthText;
  if (months === 0) return yearText;
  return `${yearText} ${monthText}`;
}

// Returns the age group value ("baby", "young", ...) for an age in years.
export function getAgeGroup(age) {
  const group = AGE_GROUPS.find((item) => age >= item.min && age < item.max);
  return group ? group.value : '';
}

// Formats an ISO date as "26 Oct 2026".
export function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Formats an ISO date as "26 Oct 2026, 3:45 pm".
export function formatDateTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Creates 4 random uppercase base-36 characters, e.g. "7KQ2".
function randomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');
}

// Generates an ID like "ADP-20261026-7KQ2" that is not already in existingIds.
export function generateRequestId(existingIds) {
  const now = new Date();
  const datePart =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  let id = `ADP-${datePart}-${randomCode()}`;
  while (existingIds.includes(id)) {
    id = `ADP-${datePart}-${randomCode()}`;
  }
  return id;
}

// Keeps only the pets that match every active filter.
export function filterPets(pets, filters) {
  const search = filters.q.trim().toLowerCase();

  return pets.filter((pet) => {
    const matchesSearch =
      !search || pet.name.toLowerCase().includes(search) || pet.breed.toLowerCase().includes(search);
    const matchesType = !filters.type || pet.type === filters.type;
    const matchesAge = !filters.age || getAgeGroup(pet.age) === filters.age;
    const matchesGender = !filters.gender || pet.gender === filters.gender;
    const matchesStatus = !filters.status || pet.adoptionStatus === filters.status;
    return matchesSearch && matchesType && matchesAge && matchesGender && matchesStatus;
  });
}

// Returns a new sorted array (the original array is not changed).
export function sortPets(pets, sortBy) {
  const sorted = [...pets];
  if (sortBy === 'name-desc') {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'age-asc') {
    sorted.sort((a, b) => a.age - b.age);
  } else if (sortBy === 'age-desc') {
    sorted.sort((a, b) => b.age - a.age);
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

// Works out what a pet's status should be from its adoption requests:
// any Approved request -> Adopted, any Pending -> Pending, otherwise Available.
export function getPetStatusFromRequests(petId, requests) {
  const petRequests = requests.filter((request) => request.petId === petId);
  if (petRequests.some((request) => request.status === 'Approved')) return 'Adopted';
  if (petRequests.some((request) => request.status === 'Pending')) return 'Pending';
  return 'Available';
}

// Copies text to the clipboard. Returns true if it worked.
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-HTTPS pages: use a hidden textarea instead.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  }
}

// Wraps a value in quotes for CSV and escapes any quotes inside it.
function csvCell(value) {
  const text = String(value ?? '').replace(/"/g, '""');
  return `"${text}"`;
}

// Builds a CSV file from the requests and asks the browser to download it.
export function downloadRequestsCSV(requests) {
  const headers = ['Request ID', 'Pet', 'Applicant', 'Email', 'Phone', 'Address', 'Housing', 'Experience', 'Reason', 'Submitted', 'Status'];
  const rows = requests.map((request) => [
    request.id,
    request.petName,
    request.fullName,
    request.email,
    request.phone,
    request.address,
    request.housing,
    request.experience,
    request.reason,
    formatDateTime(request.submittedAt),
    request.status,
  ]);
  const csvText = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');

  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'adoption-requests.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
