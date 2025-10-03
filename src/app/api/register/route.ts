// src/app/api/register/route.ts
import { createUser } from "@/lib/odoo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "الرجاء ملء جميع الحقول" }, { status: 400 });
        }

        const result = await createUser(name, email, password);

        if (result.success) {
            return NextResponse.json({ message: "تم إنشاء الحساب بنجاح" }, { status: 201 });
        } else {
            return NextResponse.json({ message: result.error }, { status: 400 });
        }

    } catch {
        return NextResponse.json({ message: "خطأ داخلي في الخادم" }, { status: 500 });
    }
}