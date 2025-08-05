'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '@/styles/Hero.module.css';

const imgBasePath = '/img/';
const videoPath = '/video/';

export default function Hero() {
  const homeTextRef = useRef(null);
  const quoteRef = useRef(null);
  const buttonRef = useRef(null);

  const homeTextInView = useInView(homeTextRef, { once: true, amount: 0.5 });
  const quoteInView = useInView(quoteRef, { once: true, amount: 0.5 });
  const buttonInView = useInView(buttonRef, { once: true, amount: 0.1 });

  const handleScroll = () => {
    const next = document.getElementById('about-section');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const popIn = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20, duration: 0.6 } }
  };

  return (
    <section className={styles.hero}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        poster={`${imgBasePath}homeDigital-poster.webp`}
      >
        <source src={`${videoPath}homeDigital.mp4`} type="video/mp4" />
        Tu navegador no soporta reproducción de video.
      </video>

      <motion.div
        ref={homeTextRef}
        className={styles.homeText}
        variants={fadeInUp}
        initial="hidden"
        animate={homeTextInView ? 'show' : 'hidden'}
      >
        <img
          src={`${imgBasePath}homeText.webp`}
          alt="Logo de Biblioteca Digital de Planeación"
          className={styles.homeTextImage}
          width={600}
          height={200}
        />
      </motion.div>

      <motion.div
        ref={quoteRef}
        className={styles.quoteContainer}
        variants={fadeInUp}
        initial="hidden"
        animate={quoteInView ? 'show' : 'hidden'}
      >
        <div className={styles.quoteBar} />
        <div className={styles.quoteText}>
          <h3 className={styles.quoteMain}>
            &quot;El conocimiento nos guía en la búsqueda de respuestas y soluciones para el bien común.&quot;
          </h3>
          <h3 className={styles.quoteAuthor}>- Julio Menchaca Salazar</h3>
        </div>
      </motion.div>

      <motion.div
        ref={buttonRef}
        className={styles.scrollButtonContainer}
        variants={popIn}
        initial="hidden"
        animate={buttonInView ? 'show' : 'hidden'}
      >
        <button
          type="button"
          className={styles.scrollButton}
          onClick={handleScroll}
          aria-label="Desplazar hacia sección About Us"
        />
      </motion.div>
    </section>
  );
}
