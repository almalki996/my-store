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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const { items, toggleCart } = useCartStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const totalItems = isClient ? items.reduce((total, item) => total + item.quantity, 0) : 0;
    const totalPrice = isClient ? items.reduce((total, item) => total + item.list_price * item.quantity, 0) : 0;

    useEffect(() => {
        setIsClient(true);
        const fetchCategoriesViaApi = async () => {
            setIsLoadingCategories(true);
             try {
                const response = await fetch('/api/categories');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategoriesViaApi();
    }, []);

    // Handle keyboard navigation for dropdown
    const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
        } else if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsDropdownOpen(false);
        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isDropdownOpen]);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <Link href="/" className={styles.logoLink} aria-label="الصفحة الرئيسية - ينابع الحلول">
                        <Image src="/logo.png" alt="شعار ينابع الحلول" width={40} height={40} />
                        <span className={styles.logoText}>ينابع الحلول</span>
                    </Link>
                    <nav className={styles.desktopNav} role="navigation" aria-label="التنقل الرئيسي">
                        <Link href="/" className={styles.navLink}>الرئيسية</Link>
                        <div className={styles.dropdownContainer}>
                            <span 
                                className={`${styles.navLink} ${styles.dropdownTrigger} ${isDropdownOpen ? styles.dropdownActive : ''}`} 
                                role="button" 
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                                onKeyDown={handleDropdownKeyDown}
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="menu"
                            >
                                المنتجات
                            </span>
                            <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownVisible : ''}`} role="menu">
                                    {isLoadingCategories ? (
                                        <div className={styles.dropdownLoading}>
                                            <span className={styles.loadingSpinner}></span>
                                            <span>جاري التحميل...</span>
                                        </div>
                                    ) : categories.length > 0 ? categories.map(category => (
                                        <Link 
                                            key={category.id} 
                                            href={`/category/${category.id}`} 
                                            className={styles.dropdownLink} 
                                            role="menuitem"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    )) : <span className={styles.dropdownLink}>لا توجد فئات</span>}
                            </div>
                        </div>
                        <Link href="/about" className={styles.navLink}>من نحن</Link>
                    </nav>
                </div>

                <div className={styles.centerSection}>
                    <div className={styles.searchContainer}>
                        <Searchbar />
                    </div>
                </div>

                <div className={styles.actionsContainer}>
                    <ThemeToggle />
                    
                    <div className={styles.authContainer}>
                        {session?.user ? (
                            <>
                                <span className={styles.welcomeText}>مرحباً، {session.user.name}</span>
                                <button onClick={() => signOut()} className={styles.signOutBtn} aria-label="تسجيل الخروج">خروج</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={styles.authLink}>تسجيل الدخول</Link>
                                <Link href="/register" className={styles.registerLink}>إنشاء حساب</Link>
                            </>
                        )}
                    </div>

                    <button 
                        onClick={toggleCart} 
                        className={`${styles.cartButton} ${totalItems > 0 ? styles.cartHasItems : ''}`}
                        aria-label={`فتح السلة - ${totalItems} عنصر`}
                    >
                        <div className={styles.cartIcon}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {isClient && totalItems > 0 && (
                                <span className={styles.cartBadge} aria-label={`${totalItems} عنصر في السلة`}>{totalItems}</span>
                            )}
                        </div>
                        <div className={styles.cartDetails}>
                            <span className={styles.cartLabel}>السلة</span>
                            {isClient && totalItems > 0 && (
                                <span className={styles.cartPrice}>{totalPrice.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                            )}
                        </div>
                    </button>

                    <button 
                        className={styles.mobileMenuButton} 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="فتح القائمة"
                        aria-expanded={isMenuOpen}
                    >
                        <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className={styles.mobileMenuPanel} role="dialog" aria-label="القائمة المحمولة">
                    <div className={styles.mobileSearchContainer}>
                        <Searchbar />
                    </div>
                    <nav className={styles.mobileNav} role="navigation">
                        <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
                        <div className={styles.mobileCategoriesSection}>
                            <span className={styles.mobileCategoriesTitle}>المنتجات</span>
                            {isClient && categories.length > 0 ? categories.map(category => (
                                <Link 
                                    key={category.id} 
                                    href={`/category/${category.id}`} 
                                    className={styles.mobileCategoryLink}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            )) : <span className={styles.noCategoriesText}>لا توجد فئات</span>}
                        </div>
                        <Link href="/about" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>من نحن</Link>
                    </nav>
                    <div className={styles.mobileAuthSection}>
                        {session?.user ? (
                            <>
                                <span className={styles.mobileWelcomeText}>مرحباً، {session.user.name}</span>
                                <button 
                                    onClick={() => {
                                        signOut();
                                        setIsMenuOpen(false);
                                    }} 
                                    className={styles.mobileSignOutBtn}
                                >
                                    تسجيل الخروج
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={styles.mobileAuthLink} onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>
                                <Link href="/register" className={styles.mobileRegisterLink} onClick={() => setIsMenuOpen(false)}>إنشاء حساب</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}