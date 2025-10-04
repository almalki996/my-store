// src/app/api/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/brevo";
import { verifyTurnstileToken } from "@/lib/turnstile";
import crypto from "crypto";

// تخزين مؤقت لـ reset tokens (في الإنتاج استخدم قاعدة بيانات)
const resetTokens = new Map<string, { email: string; expires: number; used: boolean }>();

// تنظيف الـ tokens المنتهية الصلاحية كل 30 دقيقة
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of resetTokens.entries()) {
    if (data.expires < now) {
      resetTokens.delete(token);
    }
  }
}, 30 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const { email, turnstileToken } = await request.json();

    // التحقق من البيانات
    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    // التحقق من Turnstile
    if (turnstileToken) {
      const isValidToken = await verifyTurnstileToken(turnstileToken);
      if (!isValidToken) {
        return NextResponse.json({ 
          error: "فشل في التحقق من أنك لست روبوت" 
        }, { status: 400 });
      }
    }

    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
    }

    // التحقق من وجود المستخدم (هنا نحتاج دالة للبحث في Odoo)
    // مؤقتاً سنفترض أن المستخدم موجود
    const userExists = true; // TODO: تحقق من Odoo
    
    if (!userExists) {
      // لأمان إضافي، نرد بنفس الرسالة حتى لو كان البريد غير موجود
      return NextResponse.json({ 
        message: "إذا كان البريد الإلكتروني مسجلاً لدينا، ستصلك رسالة استعادة كلمة المرور"
      });
    }

    // إنشاء reset token آمن
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + (30 * 60 * 1000); // 30 دقيقة

    // حفظ الـ token
    resetTokens.set(resetToken, {
      email: email.toLowerCase().trim(),
      expires,
      used: false
    });

    // إرسال الإيميل
    const emailSent = await sendPasswordResetEmail(email, 'المستخدم العزيز', resetToken);

    if (!emailSent) {
      return NextResponse.json({ 
        error: "فشل في إرسال الإيميل. يرجى المحاولة مرة أخرى" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "إذا كان البريد الإلكتروني مسجلاً لدينا، ستصلك رسالة استعادة كلمة المرور خلال دقائق قليلة"
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      error: "حدث خطأ داخلي. يرجى المحاولة مرة أخرى" 
    }, { status: 500 });
  }
}

// تصدير الـ resetTokens للاستخدام في reset-password API
export { resetTokens };