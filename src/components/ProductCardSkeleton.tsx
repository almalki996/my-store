// src/components/ProductCardSkeleton.tsx
import styles from './ProductCardSkeleton.module.css';

export default function ProductCardSkeleton() {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}></div>
            <div className={styles.content}>
                <div className={styles.titleSkeleton}></div>
                <div className={styles.priceSkeleton}></div>
            </div>
        </div>
    );
}