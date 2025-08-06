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

  // Creamos un índice Fuse sobre objetos enteros
  const fuse = useRef(
    new Fuse(datosBibliotecaDigital.cards, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'description', weight: 0.3 },
      ],
      threshold: 0.4,
      tokenize: true,
      matchAllTokens: true,
      includeScore: true,
      includeMatches: true,
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

    // Buscamos en Fuse y tomamos top 5
    const results = fuse.current.search(term).slice(0, 5);
    setSuggestions(results);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = suggestionName => {
    setSearchTerm(suggestionName);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  // Cerrar sugerencias al hacer click fuera
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

  // Función para resaltar el término buscado en la sugerencia
  const highlight = (text, matches) => {
    if (!matches) return text;
    let lastIndex = 0;
    const elements = [];
    matches.forEach(({ indices }) => {
      indices.forEach(([start, end]) => {
        elements.push(text.slice(lastIndex, start));
        elements.push(
          <mark key={start} className={styles.highlight}>
            {text.slice(start, end + 1)}
          </mark>
        );
        lastIndex = end + 1;
      });
    });
    elements.push(text.slice(lastIndex));
    return elements;
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
            {suggestions.map((res, i) => (
              <li
                key={i}
                className={styles.suggestionItem}
                onMouseDown={() => handleSuggestionClick(res.item.name)}
              >
                {highlight(res.item.name, res.matches?.filter(m => m.key === 'name'))}
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
