import NotFound from '../components/NotFound.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// NotFoundPage: shown for any URL that does not match a route.
export default function NotFoundPage() {
  usePageTitle('Page not found');
  return <NotFound emoji="🐕" title="404: Page not found" />;
}
