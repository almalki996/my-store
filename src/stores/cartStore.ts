// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
    id: number;
    name: string;
    list_price: number;
    image_1920?: string;
}
interface CartItem extends Product {
    quantity: number;
}
interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
}

export const useCartStore = create(
    persist<CartState>(
        (set) => ({
            items: [],
            isOpen: false,
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            // This is the fully implemented function
            addToCart: (product) => set((state) => {
                const existingItem = state.items.find((item) => item.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        ),
                    };
                } else {
                    return { items: [...state.items, { ...product, quantity: 1 }] };
                }
            }),

            removeFromCart: (productId) => set((state) => ({
                items: state.items.filter((item) => item.id !== productId),
            })),

            clearCart: () => set({ items: [] }),

            increaseQuantity: (productId) => set((state) => ({
                items: state.items.map(item => 
                    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
                ),
            })),

            decreaseQuantity: (productId) => set((state) => ({
                items: state.items.map(item => 
                    item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
                ).filter(item => item.quantity > 0),
            })),
        }),
        { name: 'cart-storage' }
    )
);