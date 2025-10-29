import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  album_id?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  totalAmount: number;
  addToCart: (song: CartItem) => void;
  removeFromCart: (songId: string) => void;
  clearCart: () => void;
  isInCart: (songId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("audiffy_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("audiffy_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (song: CartItem) => {
    // Check if song is already in cart
    if (cart.some((item) => item.id === song.id)) {
      toast.error("Song already in cart!");
      return;
    }

    // Check if price is 0 (free song)
    if (song.price === 0) {
      toast.error("Free songs don't need to be purchased!");
      return;
    }

    setCart((prevCart) => [...prevCart, song]);
    toast.success("Added to cart!");
  };

  const removeFromCart = (songId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== songId));
    toast.success("Removed from cart!");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("audiffy_cart");
  };

  const isInCart = (songId: string): boolean => {
    return cart.some((item) => item.id === songId);
  };

  const cartCount = cart.length;

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        totalAmount,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};