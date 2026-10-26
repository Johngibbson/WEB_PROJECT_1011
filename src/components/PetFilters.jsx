import { AGE_GROUPS, PET_STATUSES, SORT_OPTIONS } from '../utils/helpers.js';

// PetFilters: the search box, filter dropdowns and sort dropdown on the Pets page.
// It does not store anything itself: values come in as props and changes go out through callbacks.
export default function PetFilters({ searchText, onSearchChange, filters, onFilterChange, typeOptions }) {
  // Sends a dropdown change up to the parent, e.g. ("type", "Dog").
  function handleSelect(event) {
    onFilterChange(event.target.name, event.target.value);
  }

  return (
    <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
      <div className="form-group filters-search">
        <label htmlFor="pet-search">Search by name or breed</label>
        <input
          id="pet-search"
          type="search"
          placeholder="e.g. Bruno or Labrador"
          value={searchText}
          maxLength={60}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="filter-type">Animal type</label>
        <select id="filter-type" name="type" value={filters.type} onChange={handleSelect}>
          <option value="">All types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="filter-age">Age group</label>
        <select id="filter-age" name="age" value={filters.age} onChange={handleSelect}>
          <option value="">All ages</option>
          {AGE_GROUPS.map((group) => (
            <option key={group.value} value={group.value}>{group.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="filter-gender">Gender</label>
        <select id="filter-gender" name="gender" value={filters.gender} onChange={handleSelect}>
          <option value="">Any gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="filter-status">Status</label>
        <select id="filter-status" name="status" value={filters.status} onChange={handleSelect}>
          <option value="">Any status</option>
          {PET_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="filter-sort">Sort by</label>
        <select id="filter-sort" name="sort" value={filters.sort} onChange={handleSelect}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </form>
  );
}
