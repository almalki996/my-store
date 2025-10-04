# إعداد Cloudflare WAF وخدمات الحماية المجانية 🛡️

## 🔥 Web Application Firewall (WAF) - مجاني

### الوصول إلى WAF
1. Cloudflare Dashboard > اختر النطاق `sofoit.uno`
2. **Security** > **WAF**
3. **Custom rules** (5 قواعد مجانية)

### القواعد المقترحة للمتجر:

#### القاعدة 1: حماية صفحات المصادقة
```
Rule name: Protect Auth Pages
Field: URI Path
Operator: contains
Value: /login OR /register OR /api/auth OR /api/register
Action: Challenge (Managed Challenge)
```

#### القاعدة 2: حجب محاولات SQL Injection
```
Rule name: Block SQL Injection
Field: HTTP Request Body
Operator: contains
Value: union select OR drop table OR insert into OR delete from
Action: Block
```

#### القاعدة 3: Rate Limiting للـ APIs
```
Rule name: API Rate Limit
Field: URI Path
Operator: starts with
Value: /api/
Action: Rate Limit (10 requests per minute)
```

#### القاعدة 4: حماية من XSS
```
Rule name: XSS Protection
Field: Query String OR HTTP Request Body
Operator: contains
Value: <script OR javascript: OR onload= OR onerror=
Action: Block
```

#### القاعدة 5: حجب User Agents مشبوهة
```
Rule name: Block Bad Bots
Field: User Agent
Operator: contains
Value: curl OR wget OR python-requests OR scrapy
Action: Block
```

## 🚦 Rate Limiting - مجاني

### إعداد Rate Limiting:
1. **Security** > **WAF** > **Rate limiting rules**
2. **Create rule**

### قواعد Rate Limiting المقترحة:

#### للتسجيل والدخول:
```
Rule name: Auth Endpoints Limit
If URI path contains: /api/register OR /api/auth
Then: 5 requests per 10 minutes per IP
Action: Block for 1 hour
```

#### للبحث:
```
Rule name: Search API Limit  
If URI path contains: /api/search
Then: 30 requests per minute per IP
Action: Challenge
```

#### للطلبات العامة:
```
Rule name: General API Limit
If URI path starts with: /api/
Then: 100 requests per minute per IP
Action: Challenge
```

## 🤖 Bot Fight Mode - مجاني

### التفعيل:
1. **Security** > **Bots**
2. تفعيل **"Bot Fight Mode"**
3. اختر **"Definitely automated"** → Block

### الفوائد:
- ✅ حماية تلقائية من البوتات
- ✅ لا يؤثر على المستخدمين الحقيقيين
- ✅ يعمل مع Turnstile

## 📄 Page Rules - مجانية (3 قواعد)

### الوصول:
1. **Rules** > **Page Rules**
2. **Create Page Rule**

### القواعد المقترحة:

#### القاعدة 1: تحسين ملفات الصور
```
Pattern: store.sofoit.uno/images/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 week
```

#### القاعدة 2: عدم cache للـ APIs
```
Pattern: store.sofoit.uno/api/*  
Settings:
- Cache Level: Bypass
- Security Level: High
```

#### القاعدة 3: إعادة توجيه HTTPS
```
Pattern: http://store.sofoit.uno/*
Settings:
- Always Use HTTPS: On
- Automatic HTTPS Redirects: On
```

## 🔐 Security Level - مجاني

### الإعداد:
1. **Security** > **Settings**
2. **Security Level**: High
3. **Challenge Passage**: 30 minutes

### الخيارات:
- **Off**: بدون حماية
- **Essentially Off**: حماية قليلة
- **Low**: للمواقع العامة
- **Medium**: متوازن (الافتراضي)
- **High**: حماية قوية (مناسب للمتاجر)
- **I'm Under Attack**: للطوارئ

## 🌍 IP Access Rules - مجاني

### حجب دول معينة (اختياري):
1. **Security** > **WAF** > **Tools**
2. **IP Access Rules**
3. **Add rule**

```
Type: Country
Value: CN, RU, KP (مثال - اختر حسب حاجتك)
Action: Block
Note: حجب دول قد تكون مصدر هجمات
```

### السماح لـ IPs موثوقة:
```
Type: IP
Value: [IP السيرفر المحلي]
Action: Whitelist
Note: السماح لسيرفرك دائماً
```

## 📊 تفعيل Analytics - مجاني

### الإعداد:
1. **Analytics & Logs** > **Web Analytics**
2. تفعيل **"Web Analytics"**
3. **Add snippet to your site** (تلقائي مع Cloudflare)

### المعلومات المتاحة:
- عدد الزوار والصفحات
- البلدان والمتصفحات
- الهجمات المحجوبة
- أداء الموقع

## 🔧 إعدادات الأمان الإضافية

### Browser Integrity Check:
```
Security > Settings > Browser Integrity Check: On
الفائدة: يتحقق من أن المتصفح حقيقي
```

### Hotlink Protection:
```
Scrape Shield > Hotlink Protection: On
الفائدة: يمنع سرقة الصور
```

### Email Obfuscation:
```
Scrape Shield > Email Obfuscation: On  
الفائدة: يحمي عناوين البريد من البوتات
```

## 🚨 تحذيرات مهمة

### لا تحجب هذه IPs:
- IP سيرفرك المحلي
- Cloudflare IPs
- Google Bot (للـ SEO)
- مستخدمين حقيقيين من بلدك

### اختبر القواعد:
1. اختبر الموقع بعد كل قاعدة
2. راقب **Analytics** للتأكد
3. عدّل القواعد إذا حجبت مستخدمين حقيقيين

## 📈 مراقبة النتائج

### مؤشرات النجاح:
- ✅ انخفاض التسجيلات الوهمية
- ✅ تحسن سرعة الموقع
- ✅ قل عدد الهجمات في التقارير
- ✅ زيادة جودة الزوار

### أدوات المراقبة:
1. **Cloudflare Analytics**
2. **Security Events Log**
3. **Performance Insights**
4. **Bot Analytics**

## 🎯 الخطوات التالية

بعد تطبيق هذه الإعدادات:

1. **مراقبة لمدة أسبوع**
2. **ضبط القواعد حسب النتائج**
3. **إضافة Cloudflare Pages** للاستضافة
4. **تفعيل Image Optimization**

كل هذا مجاني ويعطيك حماية على مستوى المؤسسات! 🛡️