// FavoriteButton: heart toggle. aria-pressed tells screen readers whether it is "on".
export default function FavoriteButton({ petName, isFavorite, onToggle, showLabel = false }) {
  const label = isFavorite ? `Remove ${petName} from favourites` : `Add ${petName} to favourites`;

  return (
    <button
      type="button"
      className={isFavorite ? 'favorite-btn active' : 'favorite-btn'}
      aria-pressed={isFavorite}
      aria-label={showLabel ? undefined : label}
      title={label}
      onClick={onToggle}
    >
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      {showLabel && <span>{isFavorite ? ' Saved to favourites' : ' Save to favourites'}</span>}
    </button>
  );
}
