"use client";

import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import toast from 'react-hot-toast';
import styles from './ProductDetailsClient.module.css';

type Product = {
    id: number;
    name: string;
    list_price: number;
    image_1920?: string;
    description_sale?: string;
};

export default function ProductDetailsClient({ product }: { product: Product }) {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} تمت إضافته إلى السلة!`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                {product.image_1920 ? (
                    <Image
                        src={`data:image/jpeg;base64,${product.image_1920}`}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                ) : (
                    <div className={styles.noImagePlaceholder}>
                        <span className={styles.noImageText}>No Image</span>
                    </div>
                )}
            </div>
            <div className={styles.productDetails}>
                <h1 className={styles.productName}>{product.name}</h1>
                <p className={styles.productPrice}>
                    {product.list_price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                </p>
                <div className={styles.productDescription} dangerouslySetInnerHTML={{ __html: product.description_sale || 'لا يوجد وصف.' }} />
                <button onClick={handleAddToCart} className={styles.addToCartBtn}>
                    أضف إلى السلة
                </button>
            </div>
        </div>
    );
}