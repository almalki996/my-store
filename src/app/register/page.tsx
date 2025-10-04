"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Turnstile } from '@marsidev/react-turnstile';
import styles from './register.module.css';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const router = useRouter();

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'الاسم مطلوب';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'الاسم يجب أن يكون أكثر من حرفين';
        }

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
        } else if (formData.password.length < 8) {
            newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'كلمة المرور يجب أن تحتوي على أحرف وأرقام';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
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
        const loadingToast = toast.loading("جاري إنشاء حسابك...");

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password,
                    turnstileToken
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message?.includes('duplicate') || data.message?.includes('exists')) {
                    setErrors({ email: 'البريد الإلكتروني مسجل مسبقاً' });
                    throw new Error('البريد الإلكتروني مسجل مسبقاً');
                }
                throw new Error(data.message || 'فشل إنشاء الحساب');
            }

            toast.success("تم إنشاء حسابك بنجاح! جاري تسجيل الدخول...", { id: loadingToast });

            // Automatically sign in the user after registration
            const signInResult = await signIn('credentials', {
                redirect: false,
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
            });

            if (signInResult?.ok) {
                toast.success('مرحباً بك! تم تسجيل الدخول بنجاح');
                router.push('/');
            } else {
                toast.error('تم إنشاء الحساب، يرجى تسجيل الدخول');
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
                <div className={styles.header}>
                    <h1 className={styles.title}>إنشاء حساب جديد</h1>
                    <p className={styles.subtitle}>انضم إلينا واستمتع بتجربة تسوق مميزة</p>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>الاسم الكامل *</label>
                        <input 
                            id="name" 
                            name="name" 
                            type="text" 
                            required 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                            placeholder="أدخل اسمك الكامل"
                            aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {errors.name && <span id="name-error" className={styles.errorText}>{errors.name}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>البريد الإلكتروني *</label>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
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
                        <label htmlFor="password" className={styles.label}>كلمة المرور *</label>
                        <div className={styles.passwordContainer}>
                            <input 
                                id="password" 
                                name="password" 
                                type={showPassword ? "text" : "password"}
                                required 
                                value={formData.password} 
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ''}`}
                                placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
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
                        <div className={styles.passwordStrength}>
                            <div className={`${styles.strengthBar} ${
                                formData.password.length >= 8 && /(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password) 
                                    ? styles.strong 
                                    : formData.password.length >= 6 
                                        ? styles.medium 
                                        : styles.weak
                            }`}></div>
                            <span className={styles.strengthText}>
                                {formData.password.length === 0 ? '' :
                                 formData.password.length >= 8 && /(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password) ? 'قوية' :
                                 formData.password.length >= 6 ? 'متوسطة' : 'ضعيفة'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>تأكيد كلمة المرور *</label>
                        <div className={styles.passwordContainer}>
                            <input 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                type={showConfirmPassword ? "text" : "password"}
                                required 
                                value={formData.confirmPassword} 
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`${styles.input} ${styles.passwordInput} ${errors.confirmPassword ? styles.inputError : ''}`}
                                placeholder="أعد كتابة كلمة المرور"
                                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {errors.confirmPassword && <span id="confirm-password-error" className={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>

                    <div className={styles.termsContainer}>
                        <p className={styles.termsText}>
                            بإنشاء حساب، أنت توافق على{' '}
                            <Link href="/terms" className={styles.termsLink}>شروط الاستخدام</Link>{' '}
                            و{' '}
                            <Link href="/privacy" className={styles.termsLink}>سياسة الخصوصية</Link>
                        </p>
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

                    <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                        {isLoading ? (
                            <span className={styles.loadingContainer}>
                                <span className={styles.spinner}></span>
                                جاري إنشاء الحساب...
                            </span>
                        ) : (
                            'إنشاء الحساب'
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.loginLink}>
                        لديك حساب بالفعل؟{' '}
                        <Link href="/login" className={styles.loginLinkText}>
                            سجل دخولك من هنا
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}