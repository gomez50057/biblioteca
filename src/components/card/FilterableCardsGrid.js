import React from 'react';
import styles from '@/styles/card/CardsGrid.module.css';

export default function FilterableCardsGrid({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  subcategoryFilter,
  setSubcategoryFilter,
  categories,
  subMap,
}) {
  return (
    <div className={styles.filters}>
      <input
        type="search"
        placeholder="Buscar por título..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <select
        value={categoryFilter}
        onChange={e => {
          setCategoryFilter(e.target.value);
          setSubcategoryFilter('');
        }}
        className={styles.select}
      >
        <option value="">Todas Categorías</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={subcategoryFilter}
        onChange={e => setSubcategoryFilter(e.target.value)}
        className={styles.select}
        disabled={!categoryFilter}
      >
        <option value="">Todas Subcategorías</option>
        {(subMap[categoryFilter] || []).map(sub => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>
    </div>
  );
}