import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ScrollToTop: when the route changes, scroll back to the top of the page.
// It renders nothing; it only runs an effect.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
