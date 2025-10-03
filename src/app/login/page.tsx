// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn('credentials', {
            redirect: false, // We will handle redirect manually
            email: email,
            password: password,
        });

        setIsLoading(false);

        if (result?.ok) {
            // On success, redirect to the homepage
            toast.success('تم تسجيل الدخول بنجاح!');
            router.push('/');
        } else {
            // On failure, show an error message
            toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>تسجيل الدخول</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            كلمة المرور
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={styles.submitBtn}
                        >
                            {isLoading ? 'جاري التحقق...' : 'دخول'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}