# إعداد Cloudflare Turnstile - دليل خطوة بخطوة 🛡️

## الخطوة 1: الوصول إلى Turnstile في Cloudflare

1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. اختر حسابك 
3. في القائمة الجانبية، ابحث عن **"Turnstile"**
4. أو اذهب مباشرة إلى: `https://dash.cloudflare.com/[account-id]/turnstile`

## الخطوة 2: إنشاء Site Key جديد

1. اضغط على **"Add site"**
2. املأ المعلومات التالية:

### إعدادات الموقع:
- **Site name**: `متجر SofoIT - Turnstile`
- **Domain**: `store.sofoit.uno`
- **Widget mode**: `Managed` (الأفضل للمبتدئين)
- **Pre-clearance**: `Off` (اتركه مغلق)

### إعدادات الأمان (اختيارية):
- **Challenge Timeout**: `300 seconds` (5 دقائق)
- **Action**: `allow` 
- **Cframe**: `allow`
- **Data Consent**: `allow`

## الخطوة 3: احصل على المفاتيح

بعد إنشاء الموقع، ستحصل على:

1. **Site Key** (عام - يُستخدم في الفرونت إند)
2. **Secret Key** (سري - يُستخدم في الباك إند)

## الخطوة 4: إضافة المفاتيح لملف البيئة

افتح ملف `.env.local` وأضف:

```bash
# Cloudflare Turnstile Keys
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAAvB_your_site_key_here
TURNSTILE_SECRET_KEY=0x4AAAAAAAAvB_your_secret_key_here
```

⚠️ **تحذيرات مهمة:**
- **Site Key** يبدأ بـ `0x4AA...` ويمكن رؤيته في الكود
- **Secret Key** يبدأ بـ `0x4AA...` ويجب أن يبقى سرياً
- لا تشارك الـ Secret Key مع أحد!

## الخطوة 5: إعادة تشغيل المشروع

```bash
npm run dev
```

## الخطوة 6: اختبار Turnstile

1. اذهب إلى `http://localhost:3000/register`
2. املأ النموذج
3. يجب أن ترى widget Turnstile في الأسفل
4. أكمل التحدي واضغط "إنشاء الحساب"

## خيارات التخصيص المتقدمة

### أنواع Widget:
- **Managed**: تلقائي (الأفضل)
- **Non-interactive**: غير تفاعلي
- **Invisible**: مخفي

### السمات (Themes):
- **Light**: فاتح
- **Dark**: مظلم  
- **Auto**: تلقائي حسب النظام

### اللغات المدعومة:
- `ar` - العربية
- `en` - الإنجليزية
- `fr` - الفرنسية
- وغيرها...

## إحصائيات Turnstile

في Cloudflare Dashboard > Turnstile > Analytics ستجد:
- عدد التحديات المحلولة
- معدل النجاح
- البلدان والأوقات
- أنواع التهديدات المحجوبة

## استكشاف الأخطاء

### خطأ: "Invalid site key"
- تأكد من Site Key صحيح
- تأكد من Domain مطابق في إعدادات Turnstile

### خطأ: "Token validation failed"
- تأكد من Secret Key صحيح
- تأكد من الـ token لم تنته صلاحيته

### خطأ: "Domain mismatch"
- تأكد من إضافة `localhost` و `store.sofoit.uno` في إعدادات Turnstile

## الفوائد المتوقعة 🎯

بعد التفعيل ستحصل على:
- ✅ حماية من 95%+ من البوتات
- ✅ تقليل التسجيلات الوهمية
- ✅ حماية من محاولات الهجوم الآلية
- ✅ تحسين جودة المستخدمين
- ✅ إحصائيات مفصلة مجانية

## المرحلة التالية

بعد تفعيل Turnstile، يمكننا إضافة:
1. **WAF Rules** - قواعد حماية متقدمة
2. **Rate Limiting** - تحديد عدد الطلبات
3. **Bot Fight Mode** - حماية إضافية من البوتات
4. **Page Rules** - تحسين الأداء

كل هذا **مجاني** مع Cloudflare! 🚀