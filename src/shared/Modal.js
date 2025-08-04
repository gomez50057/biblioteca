'use client';

import React from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, booksData, children }) {
  if (!isOpen || !booksData) return null;
  const { types, name, año, descriptionBook, pdfSrc } = booksData;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>

        <h2 className={styles.title}>{name}</h2>
        <p className={styles.description}>{descriptionBook}</p>
        <p className={styles.category}>Categoría: {types.join(', ')}</p>
        {/* <p className={styles.year}>Año de Publicación: {año}</p> */}

        <div className={styles.actions}>
          <a href={pdfSrc} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            <span>Visualizar</span>
          </a>
        </div>
        <div className={styles.actions}>
          <a href={pdfSrc} download className={styles.cta}>
            <span>Descargar PDF</span>
            <svg width="13" height="10" viewBox="0 0 13 10">
              <path d="M1,5 L11,5" />
              <polyline points="8 1 12 5 8 9" />
            </svg>
          </a>
        </div>

        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  booksData: PropTypes.shape({
    types: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    año: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    descriptionBook: PropTypes.string,
    pdfSrc: PropTypes.string,
  }),
  children: PropTypes.node,
};

Modal.defaultProps = {
  booksData: null,
  children: null,
};
