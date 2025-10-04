# دليل إعداد Brevo (SendinBlue) - 9,000 إيميل مجاني شهرياً 📧

## 🎯 **الخطوة الأولى: إنشاء حساب Brevo**

### 1. **اذهب إلى موقع Brevo:**
```
https://www.brevo.com
```

### 2. **إنشاء حساب مجاني:**
- اضغط **"Sign up for free"**
- املأ النموذج:
  - **First Name**: Az
  - **Last Name**: Almalki  
  - **Email**: az.almalki.1996@gmail.com
  - **Password**: كلمة مرور قوية
  - **Company**: SofoIT Store
  - **Country**: Saudi Arabia
  - **Phone**: رقمك (اختياري)

### 3. **تأكيد الحساب:**
- تحقق من بريدك الإلكتروني
- اضغط على رابط التفعيل من Brevo

---

## 🔑 **الخطوة الثانية: الحصول على API Key**

### 1. **بعد تسجيل الدخول:**
- في Dashboard الرئيسي، اذهب إلى **"Settings"** (أعلى اليمين)
- أو **"Account"** → **"SMTP & API"**

### 2. **إنشاء API Key:**
- اضغط **"Generate a new API key"**
- **Name**: `Store Email API`
- **Scopes** (اختر هذه):
  ✅ **Send transactional emails**  
  ✅ **Manage contacts**
  ✅ **Access account details**

### 3. **احفظ الـ API Key:**
```
انسخ الـ API Key (يبدأ بـ xkeysib-)
⚠️ لن تتمكن من رؤيته مرة أخرى!
```

---

## 🌐 **الخطوة الثالثة: إعداد Domain للإيميلات**

### 1. **إضافة النطاق:**
- **Settings** → **"Senders & IP"**
- اضغط **"Add a domain"**
- أدخل: `sofoit.uno`

### 2. **إعداد DNS Records في Cloudflare:**

اذهب إلى **Cloudflare Dashboard** → `sofoit.uno` → **DNS**

أضف هذه الـ Records:

#### **SPF Record:**
```
Type: TXT
Name: @
Content: v=spf1 include:spf.sendinblue.com ~all
TTL: Auto
```

#### **DKIM Record:**
```
Type: CNAME
Name: mail._domainkey
Content: mail._domainkey.sofoit.uno.dkim.sendinblue.com
TTL: Auto
```

#### **DMARC Record:**
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none; rua=mailto:admin@sofoit.uno
TTL: Auto
```

### 3. **التحقق من الإعداد:**
- عد إلى Brevo → **"Senders & IP"**
- اضغط **"Verify"** بجانب `sofoit.uno`
- يجب أن تظهر علامات خضراء ✅

---

## 💻 **الخطوة الرابعة: إضافة API Key للمشروع**

### افتح ملف `.env.local` وأضف:

```bash
# Brevo (SendinBlue) - 9,000 emails/month مجاناً
BREVO_API_KEY=xkeysib-YOUR_ACTUAL_API_KEY_HERE
```

### مثال:
```bash
BREVO_API_KEY=xkeysib-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## 🧪 **الخطوة الخامسة: اختبار النظام**

### 1. **أعد تشغيل المشروع:**
```bash
npm run dev
```

### 2. **اختبر التسجيل:**
- اذهب إلى `http://localhost:3000/register`
- سجل حساب جديد بإيميلك الحقيقي
- يجب أن يصلك **إيميل ترحيب** خلال دقائق

### 3. **اختبر استعادة كلمة المرور:**
- اذهب إلى `http://localhost:3000/forgot-password`
- أدخل إيميلك
- يجب أن يصلك **إيميل استعادة كلمة المرور**

---

## 📊 **مراقبة الإحصائيات**

### في Brevo Dashboard:
- **Statistics** → **Email**
- ستجد:
  - عدد الإيميلات المرسلة
  - معدل التسليم
  - معدل الفتح
  - الأخطاء إن وجدت

### الحد المجاني:
```
✅ 9,000 إيميل/شهر (300/يوم)
✅ إيميلات ترحيب
✅ استعادة كلمة المرور  
✅ تأكيد الطلبات
✅ Marketing emails
```

---

## 🔧 **استكشاف الأخطاء**

### **خطأ: "Invalid API key"**
- تأكد من نسخ الـ API Key بالكامل
- تأكد من عدم وجود مسافات إضافية
- تأكد من إعادة تشغيل المشروع

### **خطأ: "Domain not verified"**
- تحقق من DNS Records في Cloudflare
- انتظر حتى 24 ساعة لانتشار DNS
- استخدم أدوات فحص DNS مثل `nslookup`

### **الإيميلات لا تصل:**
- تحقق من مجلد الـ Spam
- تأكد من صحة عنوان البريد
- راجع **Statistics** في Brevo للأخطاء

### **خطأ: "Rate limit exceeded"**
- تجاوزت الحد اليومي (300 إيميل)
- انتظر حتى اليوم التالي
- أو ارقي لخطة مدفوعة

---

## 🎉 **النتائج المتوقعة**

### بعد الإعداد الناجح:
- ✅ **إيميلات ترحيب** للمستخدمين الجدد
- ✅ **استعادة كلمة المرور** تعمل بسلاسة
- ✅ **Templates احترافية** بالعربية
- ✅ **9,000 إيميل مجاني** شهرياً
- ✅ **إحصائيات مفصلة** في Dashboard

### الإيميلات ستبدو هكذا:
- 🎨 **تصميم احترافي** بالعربية
- 📱 **متجاوب** مع الهاتف والحاسوب
- 🎯 **زر CTA واضح** للعمليات
- 🛡️ **آمن ومشفر** مع DKIM/SPF

---

## 🔄 **الخطوات التالية**

بعد نجاح الإعداد:
1. **اختبر جميع الإيميلات** (ترحيب، استعادة كلمة المرور)
2. **أضف إيميلات تأكيد الطلبات**
3. **أنشئ campaigns تسويقية**
4. **راقب الإحصائيات** وحسّن النتائج

---

## 💰 **التكلفة المستقبلية**

### الخطة المجانية:
- **9,000 إيميل/شهر**: مجاني مدى الحياة
- مثالي للمتاجر الصغيرة-المتوسطة

### إذا احتجت أكثر:
- **Lite Plan**: $25/شهر (20,000 إيميل)
- **Premium Plan**: $65/شهر (120,000 إيميل)

**ابدأ الآن واستمتع بـ 9,000 إيميل مجاني! 🚀**