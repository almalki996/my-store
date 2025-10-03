# دليل التطوير - إضافة مكونات جديدة

## إنشاء مكون جديد مع CSS Module

### 1. إنشاء ملف المكون

```tsx
// src/components/MyComponent.tsx
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
```

### 2. إنشاء ملف CSS Module

```css
/* src/components/MyComponent.module.css */
.container {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.title {
  color: var(--text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.content {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* حالات التفاعل */
.container:hover {
  box-shadow: var(--shadow-md);
  transition: var(--transition-all);
}

/* الوضع الليلي */
:global(.dark) .container {
  background-color: var(--bg-secondary);
  border-color: var(--border-dark);
}

/* الاستجابة للشاشات */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
  
  .title {
    font-size: var(--font-size-xl);
  }
}
```

## أفضل الممارسات

### 1. تسمية الكلاسات
- استخدم أسماء وصفية: `.navigationMenu` بدلاً من `.menu`
- اتبع نمط camelCase: `.primaryButton` بدلاً من `.primary-button`

### 2. استخدام المتغيرات
```css
/* جيد ✅ */
.button {
  background-color: var(--brand-blue);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* سيء ❌ */
.button {
  background-color: #007BFF;
  padding: 16px;
  border-radius: 6px;
}
```

### 3. الوضع الليلي
```css
/* استخدم global selector للوضع الليلي */
:global(.dark) .myClass {
  color: var(--text-primary);
  background-color: var(--bg-dark);
}
```

### 4. Media Queries
```css
/* Mobile First Approach */
.container {
  /* أنماط الهاتف المحمول */
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .container {
    /* أنماط التابلت */
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .container {
    /* أنماtp الكمبيوتر */
    padding: var(--spacing-lg);
  }
}
```

## تخصيص الألوان

### إضافة لون جديد
```css
/* في src/styles/variables.css */
:root {
  --brand-purple: #8B5CF6;
  --brand-orange: #F97316;
}
```

### استخدام اللون الجديد
```css
.specialButton {
  background-color: var(--brand-purple);
  color: white;
}

.specialButton:hover {
  background-color: color-mix(in srgb, var(--brand-purple) 80%, black);
}
```

## الحركات والتأثيرات

### إنشاء حركة مخصصة
```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slideElement {
  animation: slideIn 0.3s ease-out;
}
```

### التأثيرات التفاعلية
```css
.interactiveCard {
  transition: all 0.3s ease;
  transform: scale(1);
}

.interactiveCard:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.interactiveCard:active {
  transform: scale(0.98);
}
```

## تصدير المكون

### إضافة إلى index file
```tsx
// src/components/index.ts
export { default as MyComponent } from './MyComponent';
export { default as Navbar } from './Navbar';
export { default as Footer } from './Footer';
// ... باقي المكونات
```

### استخدام المكون
```tsx
// في أي صفحة أو مكون آخر
import { MyComponent } from '@/components';

export default function SomePage() {
  return (
    <div>
      <MyComponent title="مرحباً">
        <p>محتوى المكون هنا</p>
      </MyComponent>
    </div>
  );
}
```

## أدوات مساعدة

### TypeScript Props
```tsx
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}
```

### Conditional Classes
```tsx
import clsx from 'clsx'; // npm install clsx

function Button({ variant, size, disabled }: ComponentProps) {
  return (
    <button 
      className={clsx(
        styles.button,
        styles[variant], // styles.primary, styles.secondary, etc.
        styles[size],
        disabled && styles.disabled
      )}
    >
      Click me
    </button>
  );
}
```

هذا الدليل سيساعدك في إنشاء مكونات جديدة بسهولة والحفاظ على تناسق التصميم في المشروع.