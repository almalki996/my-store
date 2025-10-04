// src/app/api/register/route.ts
import { createUser } from "@/lib/odoo";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendWelcomeEmail } from "@/lib/brevo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, turnstileToken } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "الرجاء ملء جميع الحقول" }, { status: 400 });
        }

        // التحقق من Turnstile Token
        if (turnstileToken) {
            const isValidToken = await verifyTurnstileToken(turnstileToken);
            if (!isValidToken) {
                return NextResponse.json({ 
                    message: "فشل في التحقق من أنك لست روبوت. يرجى المحاولة مرة أخرى." 
                }, { status: 400 });
            }
        } else if (process.env.NODE_ENV === 'production') {
            // في الإنتاج، Turnstile مطلوب
            return NextResponse.json({ 
                message: "يرجى التحقق من أنك لست روبوت" 
            }, { status: 400 });
        }

        const result = await createUser(name, email, password);

        if (result.success) {
            // إرسال إيميل ترحيب (لا ننتظر النتيجة لعدم إبطاء التسجيل)
            sendWelcomeEmail(email, name).catch(error => {
                console.error('Failed to send welcome email:', error);
            });
            
            return NextResponse.json({ message: "تم إنشاء الحساب بنجاح" }, { status: 201 });
        } else {

             //  v--v   أضف هذا السطر لطباعة الخطأ   v--v
            console.error("DETAILED ODOO ERROR:", result.error); 
            //  ^--^                             ^--^


            // Handle specific errors based on the code from createUser
            if (result.error === "DUPLICATE_EMAIL") {
                return NextResponse.json({ message: "هذا البريد الإلكتروني مسجل لدينا بالفعل." }, { status: 409 }); // 409 Conflict
            }
            // Generic professional error message
            return NextResponse.json({ message: "حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى." }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ message: "خطأ داخلي في الخادم." }, { status: 500 });
    }
}