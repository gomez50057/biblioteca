'use client';

import { forwardRef, useState, useEffect } from 'react';
import styles from '@/styles/About.module.css';
import { datosBibliotecaDigital } from '@/utils/utils';

const imgBasePath = '/img/';
const duration = 4000; // ms

const AboutUs = forwardRef((_, ref) => {
  const [count, setCount] = useState(0);
  const targetCount = datosBibliotecaDigital.cards.length;

  useEffect(() => {
    if (targetCount <= 0) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= targetCount) {
        clearInterval(interval);
      }
    }, duration / targetCount);
    return () => clearInterval(interval);
  }, [targetCount]);

  return (
    <section ref={ref} id="about-section" className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={`${imgBasePath}leyendo.webp`}
          alt="Persona leyendo nube de palabras"
          loading="lazy"
          className={styles.image}
        />
      </div>

      <div className={styles.textContainer}>
        <p className={styles.text}><span>Bienvenido a la </span></p>
        <h1><span className='spanDoarado'>Biblioteca Digital</span> de <span className='spanVino'>Planeación</span></h1>
        <p className={styles.text}>
          Herramienta pública para el almacenamiento y consulta de documentos, programas, planes, informes, estudios, artículos, guías y demás instrumentos.
        </p>
        <p className={styles.text}>
          Este espacio virtual tiene como objetivo ser una herramienta útil para la población, donde de manera ágil pueden consultar y descargar los materiales.
        </p>
        <p className={styles.text}>
          <span>Con la Biblioteca Digital de Planeación, contribuimos a llevar a Hidalgo a su máximo potencial.</span>
        </p>

        <div className={styles.counter}>
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
    </section>
  );
});

export default AboutUs;
