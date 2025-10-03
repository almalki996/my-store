// src/app/api/categories/route.ts
import { getCategories } from "@/lib/odoo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await getCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("API route /api/categories failed:", error);
        // Return a 500 internal server error
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}