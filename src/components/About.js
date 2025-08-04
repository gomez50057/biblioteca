'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import styles from '@/styles/About.module.css';
import { datosBibliotecaDigital } from '@/utils/utils';

const imgBasePath = '/img/';

const AboutUs = forwardRef(({ children }, ref) => {
  const [count, setCount] = useState(0);
  const duration = 4000; // Duración total de la animación en ms

  // Número total de publicaciones (cantidad de cards)
  const targetCount = datosBibliotecaDigital.cards.length;

  // Animar contador de 0 a targetCount
  useEffect(() => {
    if (targetCount <= 0) return;
    let current = 0;
    const intervalTime = duration / targetCount;
    const intervalId = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= targetCount) {
        clearInterval(intervalId);
      }
    }, intervalTime);
    return () => clearInterval(intervalId);
  }, [targetCount, duration]);

  return (
    <section id="aboutUs" ref={ref} className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={`${imgBasePath}leyendo.webp`}
          alt="Persona leyendo nube de palabras"
          loading="lazy"
          className={styles.image}
        />
      </div>
      <div className={styles.textContainer}>
        <p className={`${styles.text} animate__animated animate__fadeInRight`}>
          <span>Bienvenido a la Biblioteca Digital de Planeación</span>, herramienta pública para el almacenamiento y consulta de documentos, programas, planes, informes, estudios, artículos, guías y demás instrumentos.
        </p>
        <p className={`${styles.text} animate__animated animate__fadeInRight`}>
          Este espacio virtual tiene como objetivo ser una herramienta útil para la población, donde de manera ágil pueden consultar y descargar los materiales.
        </p>
        <p className={`${styles.text} animate__animated animate__fadeInRight`}>
          <span>Con la Biblioteca Digital de Planeación, contribuimos a llevar a Hidalgo a su máximo potencial.</span>
        </p>
        <div className={`${styles.counter} animate__animated animate__slideInDown`}>
          <img
            src={`${imgBasePath}librosTotal.webp`}
            alt="Icono de libro digital"
            className={styles.counterIcon}
          />
          <p className={styles.counterText}>
            {count} <span>Publicaciones</span>
          </p>
        </div>
      </div>
      {children}
    </section>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;
