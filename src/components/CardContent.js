import CardsGrid from "@/components/card/CardsGrid";
import styles from '@/styles/CardContent.module.css';

export default function CardContent() {
  return (
    <section className={styles.container}>
      <div className={styles.screen}>
        <CardsGrid />
      </div>
    </section>
  );
}