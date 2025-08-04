
'use client';

import React, { useState, useMemo } from 'react';
import { datosBibliotecaDigital } from '@/utils/utils';
import FilterableCardsGrid from './card/FilterableCardsGrid';
import CardsGrid from './card/CardsGrid';
import Modal from '@/shared/Modal';
import styles from '@/styles/CardContent.module.css';


const categories = ['planes', 'programas', 'guías', 'atlas', 'informes'];
const subMap = {
  planes: ['nacional', 'estatal', 'municipal'],
  programas: ['estatal', 'municipal', 'sectorial', 'institucional', 'especial'],
  guías: ['inexistente'],
  atlas: ['inexistente'],
  informes: ['nacional', 'estatal', 'municipal'],
};

export default function CardContent() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');

  const filteredCards = useMemo(() => {
    return datosBibliotecaDigital.cards.filter(card => {
      const type = card.types[0]?.toLowerCase() || '';
      const sub = card.subcategory?.toLowerCase() || '';
      if (categoryFilter && type !== categoryFilter) return false;
      if (subcategoryFilter && sub !== subcategoryFilter) return false;
      if (searchTerm && !card.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [searchTerm, categoryFilter, subcategoryFilter]);

  const openModal = card => setSelectedItem(card);
  const closeModal = () => setSelectedItem(null);

  return (
    <section className={styles.container}>
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
        <CardsGrid cards={filteredCards} openModal={openModal} />
      </div>
      <Modal isOpen={!!selectedItem} onClose={closeModal} booksData={selectedItem} />
    </section>
  );
}
