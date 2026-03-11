'use client';

import React, { useMemo } from 'react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '@/shared/Tooltip';
import styles from '@/styles/card/CardsGrid.module.css';

const imgFrontPath = '/img/caratulas/';

const typeToFile = {
  atlas: 'atlas.jpg',
  'guías': 'guías.jpg',
  informes: 'informes.jpg',
  planes: 'planes.jpg',
  programas: 'programas.jpg',
  reglamentos: 'reglamentos.jpg',
};

/*  */
/* Utilidades de búsqueda */
/*  */

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* texto */
const hasAllTokens = (text, tokens) => {
  if (!text || !tokens.length) return false;
  return tokens.every(token => text.includes(token));
};

/* texto */
const calculateTitleScore = (normalizedTitle, termNormalized, termTokens) => {
  let score = 0;

  if (!normalizedTitle || !termNormalized) return score;

  if (normalizedTitle === termNormalized) score += 1000;

  if (normalizedTitle.startsWith(termNormalized)) {
    score += 700;
  } else if (normalizedTitle.includes(termNormalized)) {
    score += 350;
  }

  const titleTokens = normalizedTitle.split(' ').filter(Boolean);

  let matchedTokens = 0;

  termTokens.forEach(token => {
    const startsWithToken = titleTokens.some(word => word.startsWith(token));
    const includesToken = normalizedTitle.includes(token);

    if (startsWithToken) {
      score += 120;
      matchedTokens += 1;
      return;
    }

    if (includesToken) {
      score += 70;
      matchedTokens += 1;
    }
  });

  if (termTokens.length > 1 && matchedTokens === termTokens.length) {
    score += 220;
  }

  return score;
};

export default function CardsGrid({
  cards = [],
  openModal,
  searchTerm = '',
}) {
  const truncate = (str, max = 30) =>
    str.length > max ? `${str.slice(0, max - 3)}...` : str;

  /*  */
  /* Normalización de tarjetas */
  /*  */
  const indexedCards = useMemo(() => {
    return cards.map((card, index) => ({
      ...card,
      _gridIndex: index,
      _normalizedName: normalizeText(card.name || ''),
    }));
  }, [cards]);

  /*  */
  /* Fuse estricto solo para título */
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
  /* Filtrado inteligente del grid */
  /*  */
  const visibleCards = useMemo(() => {
    const termNormalized = normalizeText(searchTerm);

    if (!termNormalized) return indexedCards;

    const termTokens = termNormalized.split(' ').filter(Boolean);

    /*  */
    /* 1) Coincidencia exacta */
    /*  */
    const exactMatches = indexedCards.filter(
      card => card._normalizedName === termNormalized
    );

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    /*  */
    /* 2) Títulos que empiezan con lo buscado */
    /*  */
    const startsWithMatches = indexedCards
      .filter(card => card._normalizedName.startsWith(termNormalized))
      .sort((a, b) => {
        const scoreA = calculateTitleScore(
          a._normalizedName,
          termNormalized,
          termTokens
        );
        const scoreB = calculateTitleScore(
          b._normalizedName,
          termNormalized,
          termTokens
        );

        if (scoreB !== scoreA) return scoreB - scoreA;

        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      });

    if (startsWithMatches.length > 0) {
      return startsWithMatches;
    }

    /*  */
    /* 3) Títulos que contienen todas las palabras */
    /*  */
    const allTokensMatches = indexedCards
      .filter(card => hasAllTokens(card._normalizedName, termTokens))
      .sort((a, b) => {
        const scoreA = calculateTitleScore(
          a._normalizedName,
          termNormalized,
          termTokens
        );
        const scoreB = calculateTitleScore(
          b._normalizedName,
          termNormalized,
          termTokens
        );

        if (scoreB !== scoreA) return scoreB - scoreA;

        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      });

    if (allTokensMatches.length > 0) {
      return allTokensMatches;
    }

    /*  */
    /* 4) Fuzzy solo como respaldo */
    /*  */
    if (termNormalized.length < 3) {
      return [];
    }

    const fuzzyMatches = fuse
      .search(termNormalized, { limit: 20 })
      .filter(result => (result.score ?? 1) <= 0.22)
      .map(result => result.item);

    return fuzzyMatches;
  }, [indexedCards, fuse, searchTerm]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div className={styles.gridContainer} layout>
        {visibleCards.length === 0 ? (
          <motion.div
            className={styles.noResults}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No se encontraron resultados para tu búsqueda.
          </motion.div>
        ) : (
          visibleCards.map(card => {
            const { id, name, año, types, subcategory } = card;

            const key = id ?? name ?? card._gridIndex;
            const category = types?.[0]?.toLowerCase() || '';
            const bgClass = styles[`bg_${category}`] || styles.bg_default;
            const imgFile =
              typeToFile[category] || `${encodeURIComponent(category)}.webp`;

            return (
              <motion.div
                key={key}
                className={[styles.card, bgClass].join(' ')}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                onClick={() => openModal(card)}
                data-category={category}
                data-subcategory={subcategory}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                  }
                }}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={`${imgFrontPath}${imgFile}`}
                    alt={name}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = `${imgFrontPath}default.webp`;
                    }}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardTitle} data-type={category}>
                  <h3>{name}</h3>
                </div>

                <Tooltip text={name} offset="60%">
                  <h3 className={styles.title}>{truncate(name)}</h3>
                </Tooltip>

                <span className={styles.year}>{año}</span>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </AnimatePresence>
  );
}