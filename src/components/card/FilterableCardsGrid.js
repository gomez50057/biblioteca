'use client';

import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { datosBibliotecaDigital } from '@/utils/utils';
import styles from '@/styles/card/FilterableCardsGrid.module.css';

// Carga react-select solo en cliente para evitar SSR
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
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fuse para nombres de tarjetas
  const namesIndex = useRef(
    new Fuse(datosBibliotecaDigital.cards.map(c => c.name), {
      threshold: 0.3,
      includeScore: true,
    })
  );

  const handleSearchChange = e => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const results = namesIndex.current.search(term).slice(0, 5).map(r => r.item);
    setSuggestions(results);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = suggestion => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Opciones react-select
  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));
  const subcategoryOptions = Array.from(
    new Set(categoryFilter.flatMap(cat => subMap[cat] || []))
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
      <div className={styles.searchWrapper} ref={inputRef}>
        <input
          type="search"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((s, i) => (
              <li
                key={i}
                className={styles.suggestionItem}
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.selectWrapper}>
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter(opt => categoryFilter.includes(opt.value))}
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
          value={subcategoryOptions.filter(opt => subcategoryFilter.includes(opt.value))}
          onChange={handleSubcategoryChange}
          placeholder="Subcategorías"
          isDisabled={categoryFilter.length === 0}
          classNamePrefix="react-select"
          instanceId="subcategory-select"
        />
      </div>
    </div>
  );
}
