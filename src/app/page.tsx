// src/app/page.tsx
import { getProducts } from "@/lib/odoo";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import styles from './page.module.css';

export default async function HomePage() {
  const products = await getProducts() as Array<{ id: number; name: string; list_price: number; image_1024?: string }>;

  return (
    <>
      <Hero />
      <main id="products" className={styles.main}>
        <div className={styles.container}>
          <h2 className={styles.title}>
            أحدث المنتجات
          </h2>

          <div className={styles.grid}>
            {products.length > 0 ? (
              products.map((product: { id: number; name: string; list_price: number; image_1024?: string }) => (
                <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    {product.image_1024 ? (
                      <Image
                        src={`data:image/jpeg;base64,${product.image_1024}`}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <span className={styles.placeholderText}>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>
                      {product.name}
                    </h3>
                    <p className={styles.productPrice}>
                      {product.list_price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles.noProducts}>
                لم يتم العثور على منتجات. يرجى التأكد من إضافة منتجات ونشرها في Odoo.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}