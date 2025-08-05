'use client';

import React from 'react';
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
};

export default function CardsGrid({ cards, openModal }) {
  const truncate = (str, max = 30) =>
    str.length > max ? str.slice(0, max - 3) + '...' : str;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.gridContainer}
        layout
      >
        {cards.length === 0 ? (
          <motion.div
            className={styles.noResults}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No se encontraron resultados para tu búsqueda.
          </motion.div>
        ) : (
          cards.map(card => {
            const { id, name, año, types, subcategory } = card;
            const key = id ?? name;
            const category = types[0]?.toLowerCase() || '';
            const bgClass = styles[`bg_${category}`] || styles.bg_default;
            const imgFile = typeToFile[category] || `${encodeURIComponent(category)}.webp`;

            return (
              <motion.div
                key={key}
                className={[styles.card, bgClass].join(' ')}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => openModal(card)}
                data-category={category}
                data-subcategory={subcategory}
                role="button"
                tabIndex={0}
                onKeyPress={e => e.key === 'Enter' && openModal(card)}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={`${imgFrontPath}${imgFile}`}
                    alt={name}
                    onError={e => { e.target.onerror = null; e.target.src = `${imgFrontPath}default.webp`; }}
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