import { PLACEHOLDER_IMAGE } from '../utils/helpers.js';

// If an image link is broken, swap in the local placeholder once
// (the data-fallback flag stops an endless loop if the placeholder also fails).
function handleImageError(event) {
  const image = event.currentTarget;
  if (image.dataset.fallback) return;
  image.dataset.fallback = 'true';
  image.src = PLACEHOLDER_IMAGE;
}

// PetImage: an <img> that never shows the browser's broken-image icon.
export default function PetImage({ src, alt, className = '', lazy = true }) {
  return (
    <img
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      onError={handleImageError}
    />
  );
}
