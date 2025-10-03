# متجر ينابع الحلول

هذا مشروع متجر إلكتروني مبني باستخدام [Next.js](https://nextjs.org) و TypeScript.

## التغييرات المهمة

تم إزالة **Tailwind CSS** بالكامل من المشروع واستبداله بـ **CSS Modules** لمزيد من التحكم في التصميم:

### ما تم حذفه:
- ❌ حزمة `tailwindcss`
- ❌ حزمة `@tailwindcss/postcss`
- ❌ ملف `tailwind.config.ts`
- ❌ ملف `postcss.config.mjs`
- ❌ جميع Tailwind classes من الملفات

### ما تم إضافته:
- ✅ CSS Modules لكل مكون
- ✅ أنماط CSS مخصصة ومرنة
- ✅ دعم كامل لـ Responsive Design
- ✅ Dark Mode support (محافظ عليه)

## هيكل المشروع

```
src/
  components/
    ├── Navbar.tsx + Navbar.module.css
    ├── Cart.tsx + Cart.module.css
    ├── Hero.tsx + Hero.module.css
    ├── Footer.tsx + Footer.module.css
    ├── Searchbar.tsx + Searchbar.module.css
    ├── ThemeToggle.tsx + ThemeToggle.module.css
    ├── WhatsAppButton.tsx + WhatsAppButton.module.css
    └── ProductCardSkeleton.tsx + ProductCardSkeleton.module.css
  app/
    └── search/
        ├── page.tsx + page.module.css
        └── loading.tsx + loading.module.css
```

## البدء

أولاً، قم بتشغيل خادم التطوير:

```bash
npm run dev
# أو
yarn dev
# أو
pnpm dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح لرؤية النتيجة.

## المميزات

- 🛒 سلة مشتريات تفاعلية
- 🔍 البحث في المنتجات
- 🌙 وضع ليلي/نهاري
- 📱 تصميم متجاوب
- 🎨 CSS Modules للتحكم الكامل في التصميم
- 🔐 نظام المصادقة
- 📧 تواصل عبر WhatsApp

## تخصيص التصميم

الآن يمكنك بسهولة تخصيص التصميم من خلال:

1. **تعديل ملفات CSS Modules** الموجودة في نفس مجلد كل مكون
2. **إضافة أنماط جديدة** في `src/app/globals.css`
3. **استخدام متغيرات CSS** المخصصة
4. **إنشاء مكونات جديدة** مع ملفات CSS منفصلة

## متغيرات اللون الأساسية

```css
:root {
  --brand-blue: #007BFF;
  --brand-yellow: #FFC107;
  --brand-green: #8BC34A;
  --dark-text: #1F2937;
}
```

## التطوير المستقبلي

مع إزالة Tailwind، أصبح لديك حرية كاملة في:
- إنشاء نظام ألوان مخصص
- تطوير مكونات UI فريدة
- استخدام CSS Grid/Flexbox بحرية
- تطبيق animations مخصصة
- تحسين الأداء بدون CSS غير مستخدم
