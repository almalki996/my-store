// src/app/search/page.tsx
import { searchProducts } from "@/lib/odoo";
import Image from "next/image";
import Link from "next/link";
import styles from './page.module.css';

type Props = {
    searchParams: { q?: string };
};

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const products = await searchProducts(query) as Array<{ id: number; name: string; list_price: number; image_1024?: string }>;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          نتائج البحث عن: <span className={styles.query}>{query}</span>
        </h1>
        <p className={styles.count}>
            تم العثور على {products.length} منتج.
        </p>

        <div className={styles.grid}>
          {products.length > 0 ? (
            products.map((product: { id: number; name: string; list_price: number; image_1024?: string }) => (
              <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  {product.image_1024 ? <Image src={`data:image/jpeg;base64,${product.image_1024}`} alt={product.name} layout="fill" objectFit="cover"/> : <div className={styles.placeholderImage}><span className={styles.placeholderText}>No Image</span></div>}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>{product.list_price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.noResults}>
              لم يتم العثور على منتجات تطابق بحثك.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}