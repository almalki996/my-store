// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from './checkout.module.css';

export default function CheckoutPage() {
    const { items, clearCart, toggleCart } = useCartStore();
    const totalPrice = items.reduce((total, item) => total + item.list_price * item.quantity, 0);
    const router = useRouter();

    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loadingToast = toast.loading("جاري إرسال طلبك...");

        const orderData = {
            customer: formData,
            items: items.map(item => ({ id: item.id, quantity: item.quantity })),
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('فشل إرسال الطلب');
            }

            toast.success("تم استلام طلبك بنجاح!", { id: loadingToast });
            clearCart(); // Clear the cart after successful order
            toggleCart(); // Close the cart if it's open
            router.push('/'); // Redirect to homepage

        } catch (error) {
            toast.error("حدث خطأ أثناء إرسال الطلب.", { id: loadingToast });
            console.error("Checkout failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.checkoutCard}>
                <h1 className={styles.title}>إتمام الشراء</h1>
                <div className={styles.gridContainer}>
                    <div>
                        <h2 className={styles.sectionTitle}>ملخص الطلب</h2>
                        <div className={styles.orderSummary}>
                            {items.map(item => (
                                <div key={item.id} className={styles.orderItem}>
                                    <div className={styles.orderItemDetails}>
                                        <p className={styles.orderItemName}>{item.name}</p>
                                        <p className={styles.orderItemQuantity}>الكمية: {item.quantity}</p>
                                    </div>
                                    <p className={styles.orderItemPrice}>
                                        {(item.list_price * item.quantity).toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <hr className={styles.divider} />
                        <div className={styles.totalPrice}>
                            <span>المجموع الكلي:</span>
                            <span>{totalPrice.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className={styles.sectionTitle}>بيانات الدفع والشحن</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name" className={styles.label}>الاسم الكامل</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    required 
                                    onChange={handleInputChange} 
                                    value={formData.name} 
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.label}>البريد الإلكتروني</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    required 
                                    onChange={handleInputChange} 
                                    value={formData.email} 
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="address" className={styles.label}>العنوان</label>
                                <textarea 
                                    id="address" 
                                    name="address" 
                                    required 
                                    onChange={handleInputChange} 
                                    value={formData.address} 
                                    rows={3} 
                                    className={styles.textarea}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={styles.submitBtn} 
                                disabled={items.length === 0 || isSubmitting}
                            >
                                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}