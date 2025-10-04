import { getProductsByCategory } from "@/lib/odoo";
import Image from "next/image";
import Link from "next/link";
import styles from './category.module.css';

type Props = {
    params: { id: string };
};

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.id, 10);
  const products = await getProductsByCategory(categoryId) as Array<{ id: number; name: string; list_price: number; image_1024?: string }>;

  // Optional: You could also fetch category details to display the name
  // const category = await getCategoryById(categoryId);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          منتجات الفئة
        </h1>

        <div className={styles.productGrid}>
          {products.length > 0 ? (
            products.map((product: { id: number; name: string; list_price: number; image_1024?: string }) => (
              <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  {product.image_1024 ? (
                    <Image
                      src={`data:image/jpeg;base64,${product.image_1024}`}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.noImagePlaceholder}>
                      <span className={styles.noImageText}>No Image</span>
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
              لا توجد منتجات في هذه الفئة حاليًا.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}