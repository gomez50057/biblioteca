// FilterableCardsGrid.js
'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import styles from '@/styles/card/FilterableCardsGrid.module.css';

// Cargamos react-select solo en cliente para evitar desajustes en SSR
const Select = dynamic(() => import('react-select'), { ssr: false });

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
  // Opciones para react-select
  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));
  const subcategoryOptions = Array.from(
    new Set(
      categoryFilter.flatMap(cat => subMap[cat] || [])
    )
  ).map(sub => ({ value: sub, label: sub }));

  const handleCategoryChange = selected => {
    const values = selected ? selected.map(o => o.value) : [];
    setCategoryFilter(values);
    setSubcategoryFilter([]);
  };

  const handleSubcategoryChange = selected => {
    const values = selected ? selected.map(o => o.value) : [];
    setSubcategoryFilter(values);
  };

  return (
    <div className={styles.filters}>
      <input
        type="search"
        placeholder="Buscar por título..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div >
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter(opt => categoryFilter.includes(opt.value))}
          onChange={handleCategoryChange}
          placeholder="Selecciona categorías..."
          classNamePrefix="react-select"
          instanceId="category-select"
        />
      </div>

      <div >
        <Select
          isMulti
          options={subcategoryOptions}
          value={subcategoryOptions.filter(opt => subcategoryFilter.includes(opt.value))}
          onChange={handleSubcategoryChange}
          placeholder="Selecciona subcategorías..."
          isDisabled={categoryFilter.length === 0}
          classNamePrefix="react-select"
          instanceId="subcategory-select"
        />
      </div>
    </div>
  );
}