// src/components/Cart.tsx
"use client";

import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from './Cart.module.css';

export default function Cart() {
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const toggleCart = useCartStore((state) => state.toggleCart);
    const increaseQuantity = useCartStore((state) => state.increaseQuantity);
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const [isVisible, setIsVisible] = useState(false);

    const totalPrice = items.reduce((total, item) => total + item.list_price * item.quantity, 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        setIsVisible(true);
        // إضافة تأثير blur للـ body
        document.body.style.overflow = 'hidden';
        
        // تنظيف عند إغلاق المكون
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // معالج النقر على الـ overlay لإغلاق السلة
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            toggleCart();
        }
    };

    // معالج مفتاح الهروب لإغلاق السلة
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                toggleCart();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [toggleCart]);

    const handleRemoveItem = async (itemId: number) => {
        setRemovingItems(prev => new Set([...prev, itemId]));
        // Add small delay for animation
        setTimeout(() => {
            removeFromCart(itemId);
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }, 300);
    };

    return (
        <div className={`${styles.cartOverlay} ${isVisible ? styles.overlayVisible : ''}`} onClick={handleOverlayClick}>
            <div className={`${styles.cart} ${isVisible ? styles.cartVisible : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h2 className={styles.title}>
                        <svg className={styles.titleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        سلة المشتريات
                    </h2>
                    {totalItems > 0 && (
                        <span className={styles.itemCount}>({totalItems} عنصر)</span>
                    )}
                </div>
                <button onClick={toggleCart} className={styles.closeBtn} aria-label="إغلاق السلة (اضغط Esc أو انقر خارج السلة)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {items.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className={styles.emptyMessage}>سلتك فارغة</p>
                    <p className={styles.emptySubMessage}>أضف منتجات لتبدأ التسوق</p>
                    <button onClick={toggleCart} className={styles.continueShopping}>
                        متابعة التسوق
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <div 
                                key={item.id} 
                                className={`${styles.item} ${removingItems.has(item.id) ? styles.itemRemoving : ''}`}
                            >
                                <div className={styles.itemImage}>
                                    {item.image_1920 ? (
                                        <Image
                                            src={`data:image/jpeg;base64,${item.image_1920}`}
                                            alt={item.name}
                                            width={60}
                                            height={60}
                                            className={styles.productImage}
                                        />
                                    ) : (
                                        <div className={styles.placeholderImage}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemName}>{item.name}</p>
                                    <p className={styles.itemPrice}>
                                        {item.list_price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                                    </p>
                                    <p className={styles.itemTotal}>
                                        المجموع: {(item.list_price * item.quantity).toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                                    </p>
                                </div>
                                <div className={styles.itemActions}>
                                    <div className={styles.quantityControls}>
                                        <button 
                                            onClick={() => increaseQuantity(item.id)} 
                                            className={styles.quantityBtn}
                                            aria-label="زيادة الكمية"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                        </button>
                                        <span className={styles.quantity}>{item.quantity}</span>
                                        <button 
                                            onClick={() => decreaseQuantity(item.id)} 
                                            className={styles.quantityBtn}
                                            aria-label="تقليل الكمية"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)} 
                                        className={styles.removeBtn}
                                        disabled={removingItems.has(item.id)}
                                        aria-label="إزالة من السلة"
                                    >
                                        {removingItems.has(item.id) ? (
                                            <span className={styles.loadingSpinner}></span>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>عدد العناصر:</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>المجموع الفرعي:</span>
                                <span>{totalPrice.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                            </div>
                        </div>
                        <div className={styles.total}>
                            <span>المجموع الكلي:</span>
                            <span>{totalPrice.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                        </div>
                        <div className={styles.actions}>
                            <Link href="/checkout" onClick={toggleCart} className={styles.checkoutLink}>
                                <button className={styles.checkoutBtn} disabled={items.length === 0}>
                                    <svg className={styles.checkoutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                                    </svg>
                                    إتمام الشراء
                                </button>
                            </Link>
                            <button onClick={toggleCart} className={styles.continueShoppingBtn}>
                                متابعة التسوق
                            </button>
                        </div>
                    </div>
                </>
            )}
            </div>
        </div>
    );
}