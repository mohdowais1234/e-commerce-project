import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("aura_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("aura_cart", JSON.stringify(items));
    }
  }, [items, initialized]);

  const addToCart = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.productId === newItem.productId);
      if (existing) {
        return currentItems.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
