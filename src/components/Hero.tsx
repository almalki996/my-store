// src/components/Hero.tsx
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <div className={styles.hero}>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    اكتشف أحدث المنتجات التقنية
                </h1>
                <p className={styles.subtitle}>
                    أفضل العروض على أحدث الأجهزة والإلكترونيات
                </p>
                <Link href="#products" className={styles.ctaButton}>
                    تسوق الآن
                </Link>
            </div>
        </div>
    );
}