'use client';

import React, { useState } from 'react';
import { datosBibliotecaDigital } from '@/utils/utils';
import Tooltip from '@/shared/Tooltip';
import Modal from '@/shared/Modal';
import styles from '@/styles/card/CardsGrid.module.css';

const imgFrontPath = '/img/caratulas/';

// Mapping de categorías a nombres de archivo
const typeToFile = {
  atlas: 'atlas.jpg',
  'guías': 'guías.jpg',
  informes: 'informes.jpg',
  planes: 'planes.jpg',
  programas: 'programas.jpg',
};

export default function CardsGrid() {
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (card) => setSelectedItem(card);
  const closeModal = () => setSelectedItem(null);

  const truncate = (str, max = 30) =>
    str.length > max ? str.slice(0, max - 3) + '...' : str;

  return (
    <>
      <div className={styles.gridContainer}>
        {datosBibliotecaDigital.cards.map((card) => {
          const { name, año, types, subcategory } = card;
          const category = types[0];
          const bgClass = styles[`bg_${category}`] || styles.bg_default;
          const imgFilename = typeToFile[category] || `${encodeURIComponent(category)}.webp`;

          return (
            <div
              key={name}
              className={`${styles.card} ${bgClass}`}
              onClick={() => openModal(card)}
              data-category={category}
              data-subcategory={subcategory}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && openModal(card)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={`${imgFrontPath}${imgFilename}`}
                  alt={name}
                  onError={(e) => {
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


              <Tooltip text={name}>
                <p className={styles.title}>{truncate(name)}</p>
              </Tooltip>

              <span className={styles.year}>{año}</span>
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!selectedItem} onClose={closeModal} booksData={selectedItem} />
    </>
  );
}
