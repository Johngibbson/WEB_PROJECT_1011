import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import BackToTop from './components/BackToTop.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import HomePage from './pages/HomePage.jsx';
import PetsPage from './pages/PetsPage.jsx';
import PetDetailsPage from './pages/PetDetailsPage.jsx';
import AdoptPage from './pages/AdoptPage.jsx';
import AdoptionRequestsPage from './pages/AdoptionRequestsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Moves keyboard focus to the main content (skips the navbar links).
function skipToContent() {
  const main = document.getElementById('main-content');
  if (main) main.focus();
}

// App: the page layout (navbar, main area, footer) and the list of routes.
export default function App() {
  const location = useLocation();

  return (
    <>
      <button type="button" className="skip-link" onClick={skipToContent}>
        Skip to main content
      </button>
      <ScrollToTop />
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        {/* key resets the error boundary when the user goes to another page */}
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/pets/:id" element={<PetDetailsPage />} />
            <Route path="/adopt/:id" element={<AdoptPage />} />
            <Route path="/requests" element={<AdoptionRequestsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
      <Toast />
    </>
  );
}
