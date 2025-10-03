// src/app/register/page.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './register.module.css';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading("جاري إنشاء حسابك...");

        try {
            // We will create this API route in the next step
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'فشل إنشاء الحساب');
            }

            toast.success("تم إنشاء حسابك بنجاح!", { id: loadingToast });

            // Automatically sign in the user after registration
            const signInResult = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
            });

            if (signInResult?.ok) {
                router.push('/');
            } else {
                router.push('/login');
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
            toast.error(errorMessage, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerCard}>
                <h1 className={styles.title}>إنشاء حساب جديد</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                       <label htmlFor="name" className={styles.label}>الاسم</label>
                       <input 
                           id="name" 
                           name="name" 
                           type="text" 
                           required 
                           value={name} 
                           onChange={(e) => setName(e.target.value)} 
                           className={styles.input}
                       />
                    </div>
                    <div className={styles.inputGroup}>
                       <label htmlFor="email" className={styles.label}>البريد الإلكتروني</label>
                       <input 
                           id="email" 
                           name="email" 
                           type="email" 
                           required 
                           value={email} 
                           onChange={(e) => setEmail(e.target.value)} 
                           className={styles.input}
                       />
                    </div>
                    <div className={styles.inputGroup}>
                       <label htmlFor="password" className={styles.label}>كلمة المرور</label>
                       <input 
                           id="password" 
                           name="password" 
                           type="password" 
                           required 
                           value={password} 
                           onChange={(e) => setPassword(e.target.value)} 
                           className={styles.input}
                       />
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                            {isLoading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
                        </button>
                    </div>
                </form>
                <p className={styles.loginLink}>
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className={styles.loginLinkText}>
                        سجل دخولك من هنا
                    </Link>
                </p>
            </div>
        </div>
    );
}