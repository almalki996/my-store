"use client";

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Turnstile } from '@marsidev/react-turnstile';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('البريد الإلكتروني مطلوب');
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError('البريد الإلكتروني غير صحيح');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            toast.error('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        if (!turnstileToken) {
            toast.error('يرجى التحقق من أنك لست روبوت');
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('جاري إرسال رابط الاستعادة...');

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    turnstileToken
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('تم إرسال رابط استعادة كلمة المرور!', { id: loadingToast });
                setIsSubmitted(true);
            } else {
                toast.error(data.error || 'حدث خطأ أثناء إرسال الرابط', { id: loadingToast });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.successIcon}>✉️</div>
                    <h1 className={styles.title}>تحقق من بريدك الإلكتروني</h1>
                    <p className={styles.successMessage}>
                        تم إرسال رابط استعادة كلمة المرور إلى:
                        <br />
                        <strong>{email}</strong>
                    </p>
                    <div className={styles.instructions}>
                        <h3>الخطوات التالية:</h3>
                        <ol>
                            <li>تحقق من صندوق الوارد في بريدك الإلكتروني</li>
                            <li>اضغط على رابط "استعادة كلمة المرور"</li>
                            <li>أدخل كلمة المرور الجديدة</li>
                        </ol>
                        <div className={styles.note}>
                            <strong>ملاحظة:</strong> الرابط صالح لمدة 30 دقيقة فقط
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Link href="/login" className={styles.backButton}>
                            العودة لتسجيل الدخول
                        </Link>
                        <button 
                            onClick={() => {
                                setIsSubmitted(false);
                                setTurnstileToken('');
                            }}
                            className={styles.resendButton}
                        >
                            إرسال رابط جديد
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>نسيت كلمة المرور؟</h1>
                    <p className={styles.subtitle}>
                        لا تقلق، سنرسل لك رابطاً لاستعادة كلمة المرور
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            البريد الإلكتروني *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError('');
                            }}
                            className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                            placeholder="example@email.com"
                            aria-describedby={emailError ? "email-error" : undefined}
                        />
                        {emailError && <span id="email-error" className={styles.errorText}>{emailError}</span>}
                    </div>

                    {/* Cloudflare Turnstile */}
                    <div className={styles.turnstileContainer}>
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                            onSuccess={setTurnstileToken}
                            onError={() => setTurnstileToken('')}
                            onExpire={() => setTurnstileToken('')}
                            options={{
                                theme: 'auto',
                                language: 'ar'
                            }}
                            className={styles.turnstile}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !turnstileToken}
                        className={styles.submitButton}
                    >
                        {isLoading ? (
                            <span className={styles.loadingContainer}>
                                <span className={styles.spinner}></span>
                                جاري الإرسال...
                            </span>
                        ) : (
                            'إرسال رابط الاستعادة'
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.loginLink}>
                        تذكرت كلمة المرور؟{' '}
                        <Link href="/login" className={styles.link}>
                            تسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}