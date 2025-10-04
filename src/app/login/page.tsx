"use client";

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Turnstile } from '@marsidev/react-turnstile';
import styles from './login.module.css';

interface FormErrors {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const error = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    useEffect(() => {
        // Check if user is already logged in
        const checkSession = async () => {
            const session = await getSession();
            if (session) {
                router.push(callbackUrl);
            }
        };
        checkSession();

        // Show error message if redirected from failed auth
        if (error) {
            if (error === 'CredentialsSignin') {
                toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else {
                toast.error('حدث خطأ أثناء تسجيل الدخول');
            }
        }

        // Load saved email if remember me was checked
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, [error, callbackUrl, router]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صحيح';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'كلمة المرور مطلوبة';
        } else if (formData.password.length < 6) {
            newErrors.password = 'كلمة المرور قصيرة جداً';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('يرجى تصحيح الأخطاء في النموذج');
            return;
        }

        // التحقق من Turnstile
        if (!turnstileToken) {
            toast.error('يرجى التحقق من أنك لست روبوت');
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('جاري تسجيل الدخول...');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
            });

            if (result?.ok) {
                // Save email if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                toast.success('مرحباً بك! تم تسجيل الدخول بنجاح', { id: loadingToast });
                
                // Small delay to show success message
                setTimeout(() => {
                    router.push(callbackUrl);
                }, 500);
            } else {
                if (result?.error === 'CredentialsSignin') {
                    setErrors({ 
                        email: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
                        password: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                    });
                    toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة', { id: loadingToast });
                } else {
                    toast.error('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى', { id: loadingToast });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>مرحباً بعودتك</h1>
                    <p className={styles.subtitle}>سجل دخولك للمتابعة إلى حسابك</p>
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
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            placeholder="example@email.com"
                            aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && <span id="email-error" className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            كلمة المرور *
                        </label>
                        <div className={styles.passwordContainer}>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ''}`}
                                placeholder="أدخل كلمة المرور"
                                aria-describedby={errors.password ? "password-error" : undefined}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {errors.password && <span id="password-error" className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkboxLabel}>تذكرني</span>
                        </label>
                        
                        <Link href="/forgot-password" className={styles.forgotLink}>
                            نسيت كلمة المرور؟
                        </Link>
                    </div>

                    {/* Cloudflare Turnstile - حماية من البوتات */}
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
                        disabled={isLoading}
                        className={styles.submitBtn}
                    >
                        {isLoading ? (
                            <span className={styles.loadingContainer}>
                                <span className={styles.spinner}></span>
                                جاري التحقق...
                            </span>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.registerLink}>
                        ليس لديك حساب؟{' '}
                        <Link href="/register" className={styles.registerLinkText}>
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}