'use client';

import styles from '@/styles/Hero.module.css';

const imgBasePath = '/img/';
const videoPath = '/video/';

export default function Hero({ aboutRef, children }) {
  const handleScroll = () => {
    if (aboutRef?.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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

      <div className={styles.homeText}>
        <img
          src={`${imgBasePath}homeText.webp`}
          alt="Logo de Biblioteca Digital de Planeación"
          className={styles.homeTextImage}
          width={600}
          height={200}
        />
      </div>

      <div className={styles.quoteContainer}>
        <div className={styles.quoteBar} />
        <div className={styles.quoteText}>
          <h3 className={styles.quoteMain}>
            "El conocimiento nos guía en la búsqueda de respuestas y soluciones para el bien común."
          </h3>
          <h3 className={styles.quoteAuthor}>- Julio Menchaca Salazar</h3>
        </div>
      </div>

      <div className={styles.scrollButtonContainer}>
        <button
          className={styles.scrollButton}
          onClick={handleScroll}
          aria-label="Desplazar hacia sección About Us"
        />
      </div>

      {children}
    </section>
  );
}
