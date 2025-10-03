// src/app/api/orders/route.ts
import { createSalesOrder } from "@/lib/odoo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { customer, items } = await req.json();

        if (!customer || !items || items.length === 0) {
            return new NextResponse('Missing customer data or items', { status: 400 });
        }

        const result = await createSalesOrder(customer, items);

        if (result.success) {
            return NextResponse.json({ success: true, orderId: result.orderId });
        } else {
            return new NextResponse(result.error || 'Failed to create order in Odoo', { status: 500 });
        }

    } catch (error) {
        console.error("/api/orders error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}