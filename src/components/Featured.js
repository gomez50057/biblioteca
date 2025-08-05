'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '@/styles/Featured.module.css';
import { datosBibliotecaDigital } from '@/utils/utils';
import Tooltip from '@/shared/Tooltip';
import Modal from '@/shared/Modal';

const imgFeaturedPath = '/img/caratulas/destacadas/';

const featuredList = [
  { name: 'Plan Estatal de Desarrollo 2022-2028', imageFile: 'PLAN_ESTATAL.webp' },
  { name: 'Guía Técnica-Metodológica para la Elaboración del Programa Municipal de Infraestructura Verde', imageFile: 'Guía Técnica-Metodológica para la Elaboración del Programa Municipal de Infraestructura Verde.webp' },
  { name: '2do Informe de Gobierno Estatal 2022-2028', imageFile: 'segundo.webp' },
  { name: 'Guía Metodológica para la Elaboración de los Programas Sectoriales y Especiales 2022-2028', imageFile: 'LINEAMIENTOS_PARA_LA_ACTUALIZACION.webp' },

];

export default function Featured() {
  const [selectedItem, setSelectedItem] = useState(null);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.8 });

  const openModal = useCallback((itemName) => {
    const item = datosBibliotecaDigital.cards.find(card => card.name === itemName);
    setSelectedItem(item || null);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const getItemVariants = (index) => ({
    hidden: { opacity: 0, y: 60, scale: 0.8, rotate: -10 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: index * 0.1,
      },
    },
  });

  return (
    <section className={styles.featured}>
      <div className={styles.background} />

      <div className={styles.subTitleContainer}>
        <h2 className="subTitle">Destacadas</h2>
      </div>

      <motion.div
        ref={containerRef}
        className={styles.containerFeatured}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {featuredList.map(({ name, imageFile }, i) => (
          <motion.div
            key={name}
            className={styles.item}
            variants={getItemVariants(i)}
            style={{ perspective: 800 }}
            whileHover={{
              scale: 1.1,
              rotateX: 5,
              rotateY: -5,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            }}
            whileTap={{
              scale: 0.95,
              rotateX: 0,
              rotateY: 0,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => openModal(name)}
            role="button"
            tabIndex={0}
            onKeyPress={e => e.key === 'Enter' && openModal(name)}
          >
            <Tooltip text={name} offset="60%">
              <motion.img
                className={styles.image}
                src={`${imgFeaturedPath}${imageFile}`}
                alt={name}
                loading="lazy"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>

      <Modal
        isOpen={!!selectedItem}
        onClose={closeModal}
        booksData={selectedItem}
      />
    </section>
  );
}
