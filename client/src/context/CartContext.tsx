import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const cartContext = createContext<CartContextType | undefined>(undefined)

export function cartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("app_cart")
        return saved ? JSON.parse(saved) : []
    })

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('app_cart', JSON.stringify(items))
    }, [items])
    
    
    
    const addToCart = (product : Product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product._id === product._id)
            if (existing) {
                return prev.map((item) => (item.product._id === product._id ? {...item, quantity : item.quantity + quantity} : item))
            }

            return [...prev, {product, quantity}]
        })
        
        setIsCartOpen(true);
    }
    
    
    
    
    const value = {
        items,
        setItems,
        isCartOpen,
        setIsCartOpen
    }


    return <cartContext.Provider value={value} >
        {children}
    </cartContext.Provider>
}

export function useCart() {
    const context = useContext(cartContext)
    if (!context) throw new Error('useCart must be used within CartProvider');

    return context;
}