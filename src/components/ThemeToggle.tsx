// src/components/ThemeToggle.tsx
"use client";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className={styles.placeholder} />;
    }

    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`${styles.toggleBtn} ${isDark ? styles.dark : styles.light}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Currently ${isDark ? 'dark' : 'light'} theme. Click to switch to ${isDark ? 'light' : 'dark'} theme.`}
        >
            <div className={styles.iconContainer}>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`${styles.icon} ${styles.sunIcon} ${!isDark ? styles.active : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`${styles.icon} ${styles.moonIcon} ${isDark ? styles.active : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 718.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </div>
            {/* Ring effect for active state */}
            <div className={`${styles.activeRing} ${isDark ? styles.activeRingDark : styles.activeRingLight}`}></div>
        </button>
    );
}
