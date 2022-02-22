import styles from '../../styles/Hero.module.css';

export default function Hero() {
  return (
    <section className={`bg-scroll ${styles.heroSection}`}>
      <div className={styles.heroText} />
    </section>
  );
}
