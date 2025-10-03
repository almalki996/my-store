// src/app/category/[id]/loading.tsx

import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import styles from './loading.module.css';

export default function LoadingCategoryPage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.titleSkeleton}></div>
                <div className={styles.productGrid}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}