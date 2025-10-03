// src/components/Cart.tsx
"use client";

import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import styles from './Cart.module.css';

export default function Cart() {
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const toggleCart = useCartStore((state) => state.toggleCart);
    const increaseQuantity = useCartStore((state) => state.increaseQuantity); //  <--  جديد
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity); //  <--  جديد

    const totalPrice = items.reduce((total, item) => total + item.list_price * item.quantity, 0);

    return (
        <div className={styles.cart}>
            <div className={styles.header}>
                <h2 className={styles.title}>سلة المشتريات</h2>
                <button onClick={toggleCart} className={styles.closeBtn}>&times;</button>
            </div>

            {items.length === 0 ? (
                <p className={styles.emptyMessage}>سلتك فارغة.</p>
            ) : (
                <>
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemName}>{item.name}</p>
                                    <p className={styles.itemPrice}>{item.list_price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <button onClick={() => increaseQuantity(item.id)} className={styles.quantityBtn}>+</button>
                                    <span className={styles.quantity}>{item.quantity}</span>
                                    <button onClick={() => decreaseQuantity(item.id)} className={styles.quantityBtn}>-</button>
                                    <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>إزالة</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>المجموع:</span>
                            <span>{totalPrice.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                        </div>
                         <Link href="/checkout" onClick={toggleCart} className={styles.checkoutLink}>
                            <button className={styles.checkoutBtn} disabled={items.length === 0}>
                            إتمام الشراء
                       </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}