import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/pets', label: 'Available Pets' },
  { to: '/requests', label: 'Adoption Requests' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

// Gives NavLink the "active" class when its route is the current page.
function linkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

// Navbar: sticky top bar with the logo, page links, favourites badge
// and a hamburger button that opens the menu on small screens.
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites } = useAppContext();
  const location = useLocation();

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Let the Escape key close the mobile menu.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link to="/" className="logo">
          <span className="logo-icon" aria-hidden="true">🐾</span>
          <span>Pawfect Match</span>
        </Link>

        <button
          type="button"
          className={menuOpen ? 'menu-toggle open' : 'menu-toggle'}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="menu-bar" />
          <span className="menu-bar" />
          <span className="menu-bar" />
        </button>

        <ul id="main-menu" className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/favorites" className={linkClass}>
              <span aria-hidden="true">♥</span> Favourites
              <span className="badge" aria-label={`${favorites.length} saved`}>
                {favorites.length}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link nav-admin active' : 'nav-link nav-admin')}>
              Admin
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
