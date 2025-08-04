import React from 'react';
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
    <div className={styles.gridContainer}>
      {cards.map(card => {
        const { name, año, types, subcategory } = card;
        const category = types[0].toLowerCase();
        const bgClass = styles[`bg_${category}`] || styles.bg_default;
        const imgFile = typeToFile[category] || `${encodeURIComponent(category)}.webp`;

        return (
          <div
            key={card.id || name}
            className={[styles.card, bgClass].join(' ')}
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
            <Tooltip text={name}>
              <h3 className={styles.title}>{truncate(name)}</h3>
            </Tooltip>
            <span className={styles.year}>{año}</span>
          </div>
        );
      })}
    </div>
  );
}