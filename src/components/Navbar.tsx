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
    const [isMenuOpen, setIsMenuOpen] = useState(false); //  <--  جديد: لحالة قائمة الجوال
    const items = useCartStore((state) => state.items);
    const toggleCart = useCartStore((state) => state.toggleCart);
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
                {/* Logo and Store Name */}
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="شعار ينابع الحلول" width={40} height={40} />
                    <span className={styles.logoText}>
                        ينابع الحلول
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>الرئيسية</Link>
                    <div className={styles.dropdown}>
                        <span className={styles.dropdownTrigger}>المنتجات</span>
                        {isClient && (
                            <div className={styles.dropdownMenu}>
                                {categories.length > 0 ? categories.map(category => (
                                    <Link key={category.id} href={`/category/${category.id}`} className={styles.dropdownItem}>{category.name}</Link>
                                )) : <span className={`${styles.dropdownItem} ${styles.emptyMessage}`}>لا توجد فئات</span>}
                            </div>
                        )}
                    </div>
                    <Link href="/about" className={styles.navLink}>من نحن</Link>
                </nav>

                {/* Right side Actions */}
                <div className={styles.rightActions}>
                    <ThemeToggle />
                    <div className={styles.searchWrapper}><Searchbar /></div>
                    {session?.user ? (
                        <div className={styles.authActions}>
                            <span className={styles.userName}>مرحباً، {session.user.name}</span>
                            <button onClick={() => signOut()} className={styles.logoutBtn}>خروج</button>
                        </div>
                    ) : (
                        <div className={styles.authActions}>
                            <Link href="/login" className={styles.loginBtn}>تسجيل الدخول</Link>
                            <Link href="/register" className={styles.registerBtn}>إنشاء حساب</Link>
                        </div>
                    )}
                    <button onClick={toggleCart} className={styles.cartBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.cartIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {isClient && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </button>
                    {/* Hamburger Menu Icon */}
                    <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileNav}>
                        <Link href="/" className={styles.mobileNavLink}>الرئيسية</Link>
                        {/* You can add a simplified category list here if needed */}
                        <Link href="/about" className={styles.mobileNavLink}>من نحن</Link>
                    </div>
                     {/* Mobile Search and Auth */}
                    <div className={styles.mobileActions}>
                        <div className={styles.mobileSearch}><Searchbar /></div>
                        {session?.user ? (
                            <div className={styles.mobileAuth}>
                                <p className={styles.mobileUserName}>مرحباً، {session.user.name}</p>
                                <button onClick={() => signOut()} className={styles.mobileLogoutBtn}>
                                    تسجيل الخروج
                                </button>
                            </div>
                        ) : (
                            <div className={styles.mobileAuthButtons}>
                                <Link href="/login" className={`${styles.mobileAuthBtn} ${styles.mobileLoginBtn}`}>تسجيل الدخول</Link>
                                <Link href="/register" className={`${styles.mobileAuthBtn} ${styles.mobileRegisterBtn}`}>إنشاء حساب</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}