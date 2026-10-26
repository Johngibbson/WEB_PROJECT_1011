import { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import samplePets from '../data/pets.js';
import { generateRequestId, getPetStatusFromRequests } from '../utils/helpers.js';
import { normalisePhone } from '../utils/validators.js';

// The context object. Components read shared data from it with useAppContext().
const AppContext = createContext(null);

// "v2" was added when the pet photos moved into the project. Changing the key makes
// browsers that saved the old data (with the old photo links) start fresh.
export const STORAGE_KEYS = {
  pets: 'pap-pets-v2',
  requests: 'pap-requests-v2',
  favorites: 'pap-favorites',
  messages: 'pap-messages',
};

// Checks stored data is an array of objects that each have an id.
function isListWithIds(value) {
  return Array.isArray(value) && value.every((item) => item && typeof item === 'object' && item.id);
}

// Checks stored pets have the fields the pages rely on, so half-broken data is replaced by the samples.
function isValidPetList(value) {
  return (
    isListWithIds(value) &&
    value.length > 0 &&
    value.every((pet) => typeof pet.name === 'string' && typeof pet.breed === 'string' && typeof pet.age === 'number')
  );
}

// Checks stored favourites are an array of strings (pet IDs).
function isListOfStrings(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

// Returns a copy of a request with a new status, adding an entry to its status history.
function withStatus(request, status, note) {
  const history = Array.isArray(request.statusHistory) ? request.statusHistory : [];
  return {
    ...request,
    status,
    statusHistory: [...history, { status, date: new Date().toISOString(), note }],
  };
}

// AppProvider wraps the whole app and holds all shared state:
// pets, adoption requests, favourites, contact messages and toast notifications.
export function AppProvider({ children }) {
  const [pets, setPets] = useLocalStorage(STORAGE_KEYS.pets, samplePets, isValidPetList);
  const [requests, setRequests] = useLocalStorage(STORAGE_KEYS.requests, [], isListWithIds);
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, [], isListOfStrings);
  const [messages, setMessages] = useLocalStorage(STORAGE_KEYS.messages, [], Array.isArray);
  const [toasts, setToasts] = useState([]);

  // ---------- Toasts ----------

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  // Shows a small pop-up message. type is "success" or "error".
  function showToast(message, type = 'success') {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  }

  // ---------- Pets and favourites ----------

  function getPetById(id) {
    return pets.find((pet) => pet.id === String(id));
  }

  function isFavorite(petId) {
    return favorites.includes(petId);
  }

  function toggleFavorite(pet) {
    if (isFavorite(pet.id)) {
      setFavorites((current) => current.filter((id) => id !== pet.id));
      showToast(`${pet.name} removed from favourites.`);
    } else {
      setFavorites((current) => [...current, pet.id]);
      showToast(`${pet.name} added to favourites.`);
    }
  }

  // ---------- Adoption requests ----------

  // Saves a new list of requests and updates the affected pet's status to match it.
  function saveRequestsAndSyncPet(updatedRequests, petId) {
    setRequests(updatedRequests);
    const newStatus = getPetStatusFromRequests(petId, updatedRequests);
    setPets((currentPets) =>
      currentPets.map((pet) => (pet.id === petId ? { ...pet, adoptionStatus: newStatus } : pet)),
    );
  }

  // Creates a new adoption request. Returns { ok: true, request } or { ok: false, error }.
  function addRequest(formValues, pet) {
    const email = formValues.email.trim().toLowerCase();

    const isDuplicate = requests.some(
      (request) =>
        request.petId === pet.id &&
        request.email.toLowerCase() === email &&
        (request.status === 'Pending' || request.status === 'Approved'),
    );
    if (isDuplicate) {
      return { ok: false, error: `You have already sent a request for ${pet.name} with this email address.` };
    }

    const currentPet = getPetById(pet.id);
    if (!currentPet || currentPet.adoptionStatus !== 'Available') {
      return { ok: false, error: `Sorry, ${pet.name} is no longer available for adoption.` };
    }

    const submittedAt = new Date().toISOString();
    const newRequest = {
      id: generateRequestId(requests.map((request) => request.id)),
      petId: pet.id,
      petName: pet.name,
      petImage: pet.image,
      fullName: formValues.fullName.trim(),
      email,
      phone: normalisePhone(formValues.phone),
      address: formValues.address.trim(),
      housing: formValues.housing,
      experience: formValues.experience,
      experienceDetails: formValues.experienceDetails.trim(),
      reason: formValues.reason.trim(),
      submittedAt,
      status: 'Pending',
      statusHistory: [{ status: 'Pending', date: submittedAt, note: 'Request submitted' }],
    };

    saveRequestsAndSyncPet([newRequest, ...requests], pet.id);
    return { ok: true, request: newRequest };
  }

  // Applicant cancels a Pending request. We keep it with status "Cancelled" so the history is not lost.
  function cancelRequest(requestId) {
    const target = requests.find((request) => request.id === requestId);
    if (!target || target.status !== 'Pending') return;

    const updated = requests.map((request) =>
      request.id === requestId ? withStatus(request, 'Cancelled', 'Cancelled by applicant') : request,
    );
    saveRequestsAndSyncPet(updated, target.petId);
    showToast(`Request ${requestId} was cancelled.`);
  }

  // Admin approves a request: the pet becomes Adopted and other pending requests for that pet are rejected.
  function approveRequest(requestId) {
    const target = requests.find((request) => request.id === requestId);
    if (!target || target.status !== 'Pending') return;

    const updated = requests.map((request) => {
      if (request.id === requestId) {
        return withStatus(request, 'Approved', 'Approved by admin');
      }
      if (request.petId === target.petId && request.status === 'Pending') {
        return withStatus(request, 'Rejected', 'Another application for this pet was approved');
      }
      return request;
    });
    saveRequestsAndSyncPet(updated, target.petId);
    showToast(`Approved! ${target.petName} has been adopted by ${target.fullName}.`);
  }

  // Admin rejects a request: the pet becomes Available again if no other request is pending.
  function rejectRequest(requestId) {
    const target = requests.find((request) => request.id === requestId);
    if (!target || target.status !== 'Pending') return;

    const updated = requests.map((request) =>
      request.id === requestId ? withStatus(request, 'Rejected', 'Rejected by admin') : request,
    );
    saveRequestsAndSyncPet(updated, target.petId);
    showToast(`Request ${requestId} was rejected.`, 'error');
  }

  // Restores the original sample pets and clears all requests.
  function resetDemoData() {
    setPets(samplePets);
    setRequests([]);
    showToast('Demo data has been reset.');
  }

  // ---------- Contact messages ----------

  function addContactMessage(formValues) {
    const newMessage = {
      id: `MSG-${Date.now()}`,
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      message: formValues.message.trim(),
      sentAt: new Date().toISOString(),
    };
    setMessages((current) => [newMessage, ...current]);
  }

  const value = {
    pets,
    requests,
    favorites,
    messages,
    toasts,
    showToast,
    dismissToast,
    getPetById,
    isFavorite,
    toggleFavorite,
    addRequest,
    cancelRequest,
    approveRequest,
    rejectRequest,
    resetDemoData,
    addContactMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook so components can write `const { pets } = useAppContext();`
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside <AppProvider>.');
  }
  return context;
}
