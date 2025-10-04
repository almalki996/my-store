// src/components/CategoriesSection.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CategoriesSection.module.css';

interface Category {
  id: number;
  name: string;
  image_1920?: string;
  image_1024?: string;
  image_512?: string;
  image_256?: string;
  image_128?: string;
}

// دالة للحصول على أفضل صورة متاحة للقسم
const getCategoryImage = (category: Category): string | null => {
  // ترتيب الصور حسب الجودة من الأعلى للأقل
  const images = [
    category.image_1024,
    category.image_512,
    category.image_256,
    category.image_128,
    category.image_1920 // أخيراً لأنها قد تكون كبيرة جداً
  ];
  
  return images.find(img => img && img.trim() !== '') || null;
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderMode, setIsSliderMode] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemsPerView = 4; // عدد العناصر المرئية في الشاشة الواحدة

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // تحديد ما إذا كان يجب استخدام slider أم لا
    setIsSliderMode(categories.length > 6);
  }, [categories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('فشل في تحميل الفئات');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    if (isSliderMode) {
      setCurrentSlide(prev => 
        prev >= Math.ceil(categories.length / itemsPerView) - 1 ? 0 : prev + 1
      );
    }
  };

  const prevSlide = () => {
    if (isSliderMode) {
      setCurrentSlide(prev => 
        prev <= 0 ? Math.ceil(categories.length / itemsPerView) - 1 : prev - 1
      );
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play للـ slider
  useEffect(() => {
    if (isSliderMode && categories.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isSliderMode, categories.length]);

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>تسوق بالأقسام</h2>
            <p className={styles.subtitle}>اكتشف مجموعتنا المتنوعة من المنتجات</p>
          </div>
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonText}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={fetchCategories} className={styles.retryBtn}>
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <p>لا توجد فئات متاحة حالياً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>تسوق بالأقسام</h2>
          <p className={styles.subtitle}>اكتشف مجموعتنا المتنوعة من المنتجات</p>
        </div>

        <div className={styles.sliderContainer}>
          {isSliderMode && (
            <>
              <button 
                onClick={prevSlide}
                className={`${styles.navBtn} ${styles.prevBtn}`}
                aria-label="الفئة السابقة"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className={`${styles.navBtn} ${styles.nextBtn}`}
                aria-label="الفئة التالية"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div 
            className={`${styles.grid} ${isSliderMode ? styles.slider : ''}`}
            ref={sliderRef}
            style={isSliderMode ? {
              transform: `translateX(${currentSlide * -100}%)`,
              width: `${Math.ceil(categories.length / itemsPerView) * 100}%`
            } : {}}
          >
            {categories.map((category, index) => (
              <Link 
                href={`/category/${category.id}`} 
                key={category.id}
                className={styles.categoryCard}
                style={isSliderMode ? {
                  width: `${100 / Math.ceil(categories.length / itemsPerView)}%`,
                  minWidth: `${100 / Math.ceil(categories.length / itemsPerView)}%`
                } : {}}
              >
                <div className={styles.imageContainer}>
                  {getCategoryImage(category) ? (
                    <Image
                      src={`data:image/jpeg;base64,${getCategoryImage(category)}`}
                      alt={category.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className={styles.categoryImage}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className={styles.overlay}>
                    <span className={styles.viewProducts}>عرض المنتجات</span>
                  </div>
                </div>
                <div className={styles.categoryInfo}>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                  <p className={styles.productCount}>
                    عرض المنتجات
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {isSliderMode && (
            <div className={styles.dots}>
              {[...Array(Math.ceil(categories.length / itemsPerView))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
                  aria-label={`انتقل إلى الشريحة ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}