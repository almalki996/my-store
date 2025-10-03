// src/app/product/[id]/page.tsx
import { getProductById } from "@/lib/odoo";
import ProductDetailsClient from "./ProductDetailsClient";
import styles from './product.module.css';

type Props = {
    params: { id: string };
};

// This is now a clean Server Component
export default async function ProductDetailPage({ params }: Props) {
    // Ensure params.id is valid before parsing
    if (!params.id || isNaN(parseInt(params.id, 10))) {
        return (
             <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>معرف المنتج غير صالح.</p>
            </div>
        );
    }

    const productId = parseInt(params.id, 10);
    const product = await getProductById(productId);

    if (!product) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>لم يتم العثور على المنتج.</p>
            </div>
        );
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <ProductDetailsClient product={product} />
            </div>
        </div>
    );
}