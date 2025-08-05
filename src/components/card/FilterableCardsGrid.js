'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import styles from '@/styles/card/FilterableCardsGrid.module.css';
const Select = dynamic(() => import('react-select'), { ssr: false });

export default function FilterableCardsGrid({
  searchTerm = '',
  setSearchTerm = () => {},
  categoryFilter = [],
  setCategoryFilter = () => {},
  subcategoryFilter = [],
  setSubcategoryFilter = () => {},
  categories = [],
  subMap = {},
}) {
  // Evitar crash si categorías o subMap no definidos
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeCategoryFilter = Array.isArray(categoryFilter) ? categoryFilter : [];
  const safeSubcategoryFilter = Array.isArray(subcategoryFilter) ? subcategoryFilter : [];

  // Opciones para react-select
  const categoryOptions = safeCategories.map(cat => ({ value: cat, label: cat }));
  const subcategoryOptions = Array.from(
    new Set(
      safeCategoryFilter.flatMap(cat => Array.isArray(subMap[cat]) ? subMap[cat] : [])
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
    <div className={styles.filtersContainer}>
      <input
        type="search"
        placeholder="Buscar por título..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.selectWrapper}>
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter(opt => safeCategoryFilter.includes(opt.value))}
          onChange={handleCategoryChange}
          placeholder="Categorías"
          classNamePrefix="react-select"
          instanceId="category-select"
        />
      </div>

      <div className={styles.selectWrapper}>
        <Select
          isMulti
          options={subcategoryOptions}
          value={subcategoryOptions.filter(opt => safeSubcategoryFilter.includes(opt.value))}
          onChange={handleSubcategoryChange}
          placeholder="Subcategorías"
          isDisabled={safeCategoryFilter.length === 0}
          classNamePrefix="react-select"
          instanceId="subcategory-select"
        />
      </div>
    </div>
  );
}
