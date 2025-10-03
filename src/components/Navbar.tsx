// src/components/Navbar.tsx
"use client";
    
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import Searchbar from './Searchbar';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

type Category = { id: number; name: string; };

export default function Navbar() {
    const { data: session } = useSession();
    const [isClient, setIsClient] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { items, toggleCart } = useCartStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const totalItems = isClient ? items.reduce((total, item) => total + item.quantity, 0) : 0;

    useEffect(() => {
        setIsClient(true);
        const fetchCategoriesViaApi = async () => {
             try {
                const response = await fetch('/api/categories');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategoriesViaApi();
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/logo.png" alt="شعار ينابع الحلول" width={40} height={40} />
                        <span className={styles.logoText}>ينابع الحلول</span>
                    </Link>
                    <nav className={styles.desktopNav}>
                        <Link href="/" className={styles.navLink}>الرئيسية</Link>
                        <div className={styles.dropdownContainer}>
                            <span className={`${styles.navLink} ${styles.dropdownTrigger}`}>المنتجات</span>
                            {isClient && (
                                <div className={styles.dropdownMenu}>
                                    {categories.length > 0 ? categories.map(category => (
                                        <Link key={category.id} href={`/category/${category.id}`} className={styles.dropdownLink}>{category.name}</Link>
                                    )) : <span className={styles.dropdownLink}>لا توجد فئات</span>}
                                </div>
                            )}
                        </div>
                        <Link href="/about" className={styles.navLink}>من نحن</Link>
                    </nav>
                </div>

                <div className={styles.actionsContainer}>
                    <div className="hidden md:block"><Searchbar /></div>
                    <ThemeToggle />
                    
                    <div className={styles.authContainer}>
                        {session?.user ? (
                            <>
                                <span className="text-sm">مرحباً، {session.user.name}</span>
                                <button onClick={() => signOut()} className="text-sm text-red-500 hover:underline">خروج</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={styles.authLink}>تسجيل الدخول</Link>
                                <Link href="/register" className={styles.registerLink}>إنشاء حساب</Link>
                            </>
                        )}
                    </div>

                    <button onClick={toggleCart} className={styles.cartButton}>
                        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {isClient && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </button>

                    <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className={styles.mobileMenuPanel}>
                    {/* Mobile menu content can be added here */}
                </div>
            )}
        </header>
    );
}