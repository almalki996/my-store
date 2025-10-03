// src/app/search/loading.tsx

import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import styles from './loading.module.css';

export default function LoadingSearchPage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.titleSkeleton}></div>
                <div className={styles.countSkeleton}></div>
                <div className={styles.grid}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}