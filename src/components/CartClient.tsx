// src/components/CartClient.tsx
"use client";

import { useEffect, useState } from "react";
import Cart from "./Cart";
import { useCartStore } from "@/stores/cartStore"; //  <--  استيراد

export default function CartClient() {
    const [isMounted, setIsMounted] = useState(false);
    const isOpen = useCartStore((state) => state.isOpen); //  <--  الحصول على حالة الفتح/الإغلاق

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    // Only render the Cart if isOpen is true
    return isOpen ? <Cart /> : null; //  <--  تعديل هنا
}