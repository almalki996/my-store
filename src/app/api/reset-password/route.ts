// src/app/api/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
// import { resetTokens } from "../forgot-password/route";

// تخزين مؤقت - في الإنتاج استخدم قاعدة بيانات مشتركة
const resetTokens = new Map<string, { email: string; expires: number; used: boolean }>();

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword, turnstileToken } = await request.json();

    // التحقق من البيانات
    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "كلمتا المرور غير متطابقتين" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 });
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

    // التحقق من صحة الـ token
    const tokenData = resetTokens.get(token);
    
    if (!tokenData) {
      return NextResponse.json({ 
        error: "رابط استعادة كلمة المرور غير صحيح أو منتهي الصلاحية" 
      }, { status: 400 });
    }

    if (tokenData.used) {
      return NextResponse.json({ 
        error: "تم استخدام هذا الرابط مسبقاً" 
      }, { status: 400 });
    }

    if (tokenData.expires < Date.now()) {
      resetTokens.delete(token);
      return NextResponse.json({ 
        error: "انتهت صلاحية رابط استعادة كلمة المرور. يرجى طلب رابط جديد" 
      }, { status: 400 });
    }

    // تحديث كلمة المرور في Odoo
    try {
      // TODO: تحديث كلمة المرور في Odoo
      // const updateResult = await updateUserPassword(tokenData.email, password);
      
      // مؤقتاً نفترض النجاح
      const updateResult = { success: true };
      
      if (!updateResult.success) {
        return NextResponse.json({ 
          error: "فشل في تحديث كلمة المرور. يرجى المحاولة مرة أخرى" 
        }, { status: 500 });
      }

      // تمييز الـ token كمستخدم
      tokenData.used = true;

      return NextResponse.json({ 
        message: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول" 
      });

    } catch (error) {
      console.error('Password update error:', error);
      return NextResponse.json({ 
        error: "حدث خطأ أثناء تحديث كلمة المرور" 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ 
      error: "حدث خطأ داخلي. يرجى المحاولة مرة أخرى" 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // للتحقق من صحة الـ token
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: "الرمز مطلوب" }, { status: 400 });
  }

  const tokenData = resetTokens.get(token);
  
  if (!tokenData || tokenData.used || tokenData.expires < Date.now()) {
    return NextResponse.json({ 
      valid: false, 
      error: "رابط استعادة كلمة المرور غير صحيح أو منتهي الصلاحية" 
    });
  }

  return NextResponse.json({ 
    valid: true, 
    email: tokenData.email.replace(/(.{2}).*(@.*)/, '$1***$2') // إخفاء جزء من البريد
  });
}