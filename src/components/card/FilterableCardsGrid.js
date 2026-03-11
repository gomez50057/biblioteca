'use client';

import dynamic from 'next/dynamic';
import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Fuse from 'fuse.js';
import { datosBibliotecaDigital } from '@/utils/utils';
import styles from '@/styles/card/FilterableCardsGrid.module.css';

/*  */
/* React Select solo en cliente */
/*  */
const Select = dynamic(() => import('react-select'), { ssr: false });

/*  */
/* Utilidades del buscador inteligente */
/*  */
const normalizeText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* texto */
const calculateTitleScore = (card, termNormalized, termTokens) => {
  const title = card._normalizedName;
  const titleTokens = card._nameTokens;

  if (!title || !termNormalized) return 0;

  let score = 0;

  /* texto */
  if (title === termNormalized) score += 1000;

  /* texto */
  if (title.startsWith(termNormalized)) {
    score += 700;
  } else if (title.includes(termNormalized)) {
    score += 450;
  }

  /* texto */
  let matchedTokens = 0;

  termTokens.forEach(token => {
    const tokenStarts = titleTokens.some(word => word.startsWith(token));
    const tokenIncluded = title.includes(token);

    if (tokenStarts) {
      score += 140;
      matchedTokens += 1;
      return;
    }

    if (tokenIncluded) {
      score += 80;
      matchedTokens += 1;
    }
  });

  /* texto */
  if (termTokens.length > 1 && matchedTokens === termTokens.length) {
    score += 260;
  }

  return score;
};

/* texto */
const getHighlightRanges = (text = '', query = '') => {
  const normalizedQueryTokens = [
    ...new Set(normalizeText(query).split(' ').filter(Boolean)),
  ];

  if (!normalizedQueryTokens.length) return [];

  let normalizedText = '';
  const indexMap = [];

  for (let i = 0; i < text.length; i += 1) {
    const cleanChar = text[i]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    for (let j = 0; j < cleanChar.length; j += 1) {
      normalizedText += cleanChar[j];
      indexMap.push(i);
    }
  }

  const ranges = [];

  normalizedQueryTokens.forEach(token => {
    let fromIndex = 0;

    while (fromIndex < normalizedText.length) {
      const start = normalizedText.indexOf(token, fromIndex);

      if (start === -1) break;

      const end = start + token.length - 1;

      ranges.push([indexMap[start], indexMap[end] + 1]);
      fromIndex = start + token.length;
    }
  });

  if (!ranges.length) return [];

  ranges.sort((a, b) => a[0] - b[0]);

  const merged = [ranges[0]];

  for (let i = 1; i < ranges.length; i += 1) {
    const current = ranges[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
};

export default function FilterableCardsGrid({
  searchTerm = '',
  setSearchTerm = () => { },
  categoryFilter = [],
  setCategoryFilter = () => { },
  subcategoryFilter = [],
  setSubcategoryFilter = () => { },
  categories = [],
  subMap = {},
}) {
  const searchWrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  /*  */
  /* Índice de títulos normalizado */
  /*  */
  const indexedCards = useMemo(() => {
    return datosBibliotecaDigital.cards.map((card, index) => {
      const normalizedName = normalizeText(card.name || '');

      return {
        ...card,
        _index: index,
        _normalizedName: normalizedName,
        _nameTokens: normalizedName.split(' ').filter(Boolean),
      };
    });
  }, []);

  /*  */
  /* Fuse enfocado en título */
  /*  */
  const fuse = useMemo(() => {
    return new Fuse(indexedCards, {
      keys: [{ name: '_normalizedName', weight: 1 }],
      threshold: 0.22,
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 3,
      shouldSort: true,
    });
  }, [indexedCards]);

  /*  */
  /* Ranking híbrido: exacto + prefijo + tokens + fuzzy */
  /*  */
  const hasAllTokens = (text, tokens) => {
    if (!text || !tokens.length) return false;
    return tokens.every(token => text.includes(token));
  };

  const getSmartSuggestions = useCallback(
    term => {
      const termNormalized = normalizeText(term);

      if (!termNormalized) return [];

      const termTokens = termNormalized.split(' ').filter(Boolean);

      /*  */
      /* Nivel 1: coincidencia exacta del título */
      /*  */
      const exactMatches = indexedCards.filter(
        card => card._normalizedName === termNormalized
      );

      if (exactMatches.length > 0) {
        return exactMatches.slice(0, 5).map(card => ({
          item: card,
          score: 1000,
        }));
      }

      /*  */
      /* Nivel 2: el título inicia con el texto buscado */
      /*  */
      const startsWithMatches = indexedCards.filter(card =>
        card._normalizedName.startsWith(termNormalized)
      );

      if (startsWithMatches.length > 0) {
        return startsWithMatches
          .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
          .slice(0, 5)
          .map(card => ({
            item: card,
            score: 800,
          }));
      }

      /*  */
      /* Nivel 3: todas las palabras están presentes en el título */
      /*  */
      const allTokensMatches = indexedCards.filter(card =>
        hasAllTokens(card._normalizedName, termTokens)
      );

      if (allTokensMatches.length > 0) {
        return allTokensMatches
          .map(card => ({
            item: card,
            score: calculateTitleScore(card, termNormalized, termTokens),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
      }

      /*  */
      /* Nivel 4: fuzzy solo como respaldo */
      /*  */
      if (termNormalized.length < 3) return [];

      const fuseResults = fuse.search(termNormalized, { limit: 5 });

      return fuseResults
        .filter(result => (result.score ?? 1) <= 0.22)
        .map(result => ({
          item: result.item,
          score: Math.round((1 - (result.score ?? 1)) * 400),
        }));
    },
    [indexedCards, fuse]
  );

  /* texto */
  useEffect(() => {
    const term = deferredSearchTerm.trim();

    if (!term) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const nextSuggestions = getSmartSuggestions(term);

    setSuggestions(nextSuggestions);
    setShowSuggestions(nextSuggestions.length > 0);
    setActiveSuggestionIndex(nextSuggestions.length ? 0 : -1);
  }, [deferredSearchTerm, getSmartSuggestions]);

  /* texto */
  const handleSearchChange = e => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  /* texto */
  const handleSuggestionClick = suggestionName => {
    setSearchTerm(suggestionName);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  /* texto */
  const handleSearchKeyDown = e => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowSuggestions(true);
      setActiveSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setShowSuggestions(true);
      setActiveSuggestionIndex(prev =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === 'Enter' && showSuggestions && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestionIndex].item.name);
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  useEffect(() => {
  const term = deferredSearchTerm.trim();

  if (!term) {
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    return;
  }

  const nextSuggestions = getSmartSuggestions(term);

  setSuggestions(nextSuggestions);
  setShowSuggestions(nextSuggestions.length > 0);
  setActiveSuggestionIndex(nextSuggestions.length > 0 ? 0 : -1);
}, [deferredSearchTerm, getSmartSuggestions]);

  /* texto */
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* texto */
  const highlight = (text, query, keyPrefix = 'h') => {
    const ranges = getHighlightRanges(text, query);

    if (!ranges.length) return text;

    const parts = [];
    let lastIndex = 0;

    ranges.forEach(([start, end], idx) => {
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }

      parts.push(
        <mark
          key={`${keyPrefix}-${start}-${end}-${idx}`}
          className={styles.highlight}
        >
          {text.slice(start, end)}
        </mark>
      );

      lastIndex = end;
    });

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  const subcategoryOptions = Array.from(
    new Set(categoryFilter.flatMap(cat => subMap[cat] || []))
  ).map(sub => ({ value: sub, label: sub }));

  const handleCategoryChange = selected => {
    const values = selected ? selected.map(option => option.value) : [];
    setCategoryFilter(values);
    setSubcategoryFilter([]);
  };

  const handleSubcategoryChange = selected => {
    const values = selected ? selected.map(option => option.value) : [];
    setSubcategoryFilter(values);
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchWrapper} ref={searchWrapperRef}>
        <input
          ref={inputRef}
          type="search"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => {
            if (searchTerm.trim() && suggestions.length > 0) {
              setShowSuggestions(true);

              if (activeSuggestionIndex === -1) {
                setActiveSuggestionIndex(0);
              }
            }
          }}
          className={styles.searchInput}
          autoComplete="off"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="title-suggestions-list"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul
            id="title-suggestions-list"
            className={styles.suggestionsList}
            role="listbox"
          >
            {suggestions.map((res, index) => {
              const stableKey = `sugg-${res.item._index}`;
              const isActive = index === activeSuggestionIndex;

              return (
                <li
                  key={stableKey}
                  role="option"
                  aria-selected={isActive}
                  className={`${styles.suggestionItem} ${isActive ? styles.suggestionItemActive : ''
                    }`}
                  onMouseDown={() => handleSuggestionClick(res.item.name)}
                >
                  {highlight(res.item.name, searchTerm, stableKey)}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className={styles.selectWrapper}>
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter(opt =>
            categoryFilter.includes(opt.value)
          )}
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
          value={subcategoryOptions.filter(opt =>
            subcategoryFilter.includes(opt.value)
          )}
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