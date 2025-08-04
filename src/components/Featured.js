'use client';

import React, { useState, useCallback } from 'react';
import styles from '@/styles/Featured.module.css';
import { datosBibliotecaDigital } from '@/utils/utils';
import Tooltip from '@/shared/Tooltip';
import Modal from '@/shared/Modal';

const imgFeaturedPath = '/img/caratulas/destacadas/';

const featuredList = [
  {
    name: 'Plan Estatal de Desarrollo 2022-2028',
    imageFile: 'PLAN_ESTATAL.webp',
  },
  {
    name: 'Guía Técnica-Metodológica para la Elaboración del Programa Municipal de Infraestructura Verde',
    imageFile: 'Guía Técnica-Metodológica para la Elaboración del Programa Municipal de Infraestructura Verde.webp',
  },
  {
    name: '2do Informe de Gobierno Estatal 2022-2028',
    imageFile: 'segundo.webp',
  },
  {
    name: 'Guía Metodológica para la Elaboración de los Programas Sectoriales y Especiales 2022-2028',
    imageFile: 'LINEAMIENTOS_PARA_LA_ACTUALIZACION.webp',
  },
];

export default function Featured() {
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = useCallback((itemName) => {
    const item = datosBibliotecaDigital.cards.find(card => card.name === itemName);
    setSelectedItem(item || null);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <section className={styles.featured}>
      <div className={styles.background} />

      <div className={styles.subTitleContainer}>
        <h2 className='subTitle'>Destacadas</h2>
      </div>

      <div className={styles.containerFeatured}>
        {featuredList.map(({ name, imageFile }) => (
          <div
            key={name}
            className={styles.item}
            onClick={() => openModal(name)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') openModal(name); }}
          >
            <Tooltip text={name} offset="60%">
              <img
                className={styles.image}
                src={`${imgFeaturedPath}${imageFile}`}
                alt={name}
                loading="lazy"
              />
            </Tooltip>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedItem}
        onClose={closeModal}
        booksData={selectedItem}
      />
    </section>
  );
}
