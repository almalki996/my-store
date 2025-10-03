// src/components/Searchbar.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Searchbar.module.css';

export default function Searchbar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
        </form>
    );
}