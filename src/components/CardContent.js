'use client';

import React, { useMemo, useState } from 'react';
import Modal from '@/shared/Modal';
import { datosBibliotecaDigital } from '@/utils/utils';
import FilterableCardsGrid from './card/FilterableCardsGrid';
import CardsGrid from './card/CardsGrid';
import styles from '@/styles/CardContent.module.css';

const categories = ['planes', 'programas', 'guías', 'atlas', 'informes', 'reglamentos'];

const subMap = {
  planes: ['nacional', 'estatal', 'municipal'],
  programas: ['estatal', 'municipal', 'sectorial', 'institucional', 'especial', 'metropolitano'],
  guías: ['inexistente'],
  atlas: ['inexistente'],
  informes: ['nacional', 'estatal', 'municipal'],
  reglamentos: ['inexistente'],
};

export default function CardContent() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subcategoryFilter, setSubcategoryFilter] = useState([]);

  /*  */
  /* Filtrado base solo por categoría y subcategoría */
  /*  */
  const baseCards = useMemo(() => {
    return datosBibliotecaDigital.cards.filter(card => {
      const type = card.types?.[0]?.toLowerCase() || '';
      const sub = card.subcategory?.toLowerCase() || '';

      if (categoryFilter.length > 0 && !categoryFilter.includes(type)) {
        return false;
      }

      if (subcategoryFilter.length > 0 && !subcategoryFilter.includes(sub)) {
        return false;
      }

      return true;
    });
  }, [categoryFilter, subcategoryFilter]);

  const openModal = card => setSelectedItem(card);
  const closeModal = () => setSelectedItem(null);

  return (
    <section className={styles.container}>
      <h2 className='subTitle'>Documentos</h2>

      <FilterableCardsGrid
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        subcategoryFilter={subcategoryFilter}
        setSubcategoryFilter={setSubcategoryFilter}
        categories={categories}
        subMap={subMap}
      />

      <div className={styles.screen}>
        <CardsGrid
          cards={baseCards}
          searchTerm={searchTerm}
          openModal={openModal}
        />
      </div>

      <Modal
        isOpen={!!selectedItem}
        onClose={closeModal}
        booksData={selectedItem}
      />
    </section>
  );
} 