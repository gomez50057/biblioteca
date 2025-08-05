'use client';

import { forwardRef, useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import styles from '@/styles/About.module.css';
import { datosBibliotecaDigital } from '@/utils/utils';

const imgBasePath = '/img/';
const animDuration = 2; // segundos para la animación del contador

const AboutSection = forwardRef(function AboutSection(_, ref) {
  const sectionRef = useRef(null);
  // Trigger each time 80% is visible
  const isInView = useInView(sectionRef, { once: false, amount: 0.8 });

  // Display count state
  const targetCount = datosBibliotecaDigital.cards.length;
  const [displayCount, setDisplayCount] = useState(0);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (isInView) {
      // Stop any previous animation
      controlsRef.current?.stop();
      // Animate from 0 to targetCount
      controlsRef.current = animate(0, targetCount, {
        duration: animDuration,
        ease: 'easeOut',
        onUpdate(v) {
          setDisplayCount(Math.round(v));
        }
      });
    } else {
      // Optionally reset when out of view
      controlsRef.current?.stop();
      setDisplayCount(0);
    }
    // Cleanup
    return () => controlsRef.current?.stop();
  }, [isInView, targetCount]);

  // Variants para animar texto e imagen
  const imageVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
  };
  const textContainerVariant = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section ref={ref} id="about-section" className={styles.container}>
      <motion.div
        ref={sectionRef}
        className={styles.imageContainer}
        variants={imageVariant}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
      >
        <img
          src={`${imgBasePath}leyendo.webp`}
          alt="Persona leyendo nube de palabras"
          loading="lazy"
          className={styles.image}
        />
      </motion.div>

      <motion.div
        className={styles.textContainer}
        variants={textContainerVariant}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
      >
        <motion.p className={styles.text} variants={textVariant}>
          <span>Bienvenido a la </span>
        </motion.p>
        <motion.h1 variants={textVariant}>
          <span className="spanDoarado">Biblioteca Digital</span> de <span className="spanVino">Planeación</span>
        </motion.h1>
        <motion.p className={styles.text} variants={textVariant}>
          Herramienta pública para el almacenamiento y consulta de documentos, programas, planes, informes, estudios, artículos, guías y demás instrumentos.
        </motion.p>
        <motion.p className={styles.text} variants={textVariant}>
          Este espacio virtual tiene como objetivo ser una herramienta útil para la población, donde de manera ágil pueden consultar y descargar los materiales.
        </motion.p>
        <motion.p className={styles.text} variants={textVariant}>
          <span>Con la Biblioteca Digital de Planeación, contribuimos a llevar a Hidalgo a su máximo potencial.</span>
        </motion.p>

        <motion.div className={styles.counter} variants={textVariant}>
          <img
            src={`${imgBasePath}librosTotal.webp`}
            alt="Icono de libro digital"
            className={styles.counterIcon}
          />
          <motion.p className={styles.counterText}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {displayCount} <span>Publicaciones</span>
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;
