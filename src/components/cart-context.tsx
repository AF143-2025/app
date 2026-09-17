"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "BUYER" | "SELLER" | "ADMIN";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  sellerProfile?: {
    id: string;
    storeName: string;
  } | null;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  stock: number;
  category: string;
}

export interface CartItemType {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

interface CartContextType {
  items: CartItemType[];
  totalItems: number;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  userId: string;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth additions
  user: UserSession | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (userData: UserSession) => void;
  logout: () => Promise<void>;

  // Menu Drawer additions (Top-left menu)
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  // Installments in Cart additions
  purchaseType: "DIRECT" | "INSTALLMENT";
  setPurchaseType: (type: "DIRECT" | "INSTALLMENT") => void;
  installmentMonths: number;
  setInstallmentMonths: (months: number) => void;
  downPayment: number;
  setDownPayment: (amount: number) => void;

  // Wishlist additions
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [summary, setSummary] = useState({
    totalItems: 0,
    subtotal: 0,
    taxAmount: 0,
    shippingFee: 0,
    totalAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>("BUYER");
  const [user, setUser] = useState<UserSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Installment vs Direct state
  const [purchaseType, setPurchaseType] = useState<"DIRECT" | "INSTALLMENT">("DIRECT");
  const [installmentMonths, setInstallmentMonths] = useState<number>(12);
  const [downPayment, setDownPayment] = useState<number>(0);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("sama_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error("Failed to load wishlist:", e);
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem("sama_wishlist", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      showToast(exists ? "تمت إزالة المنتج من المفضلة" : "تمت إضافة المنتج إلى المفضلة ❤️");
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("sama_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.role) {
          setCurrentRole(parsed.role as Role);
        }
      }
    } catch (e) {
      console.error("Failed to load saved user session:", e);
    }
  }, []);

  const login = (userData: UserSession) => {
    setUser(userData);
    setCurrentRole(userData.role);
    try {
      localStorage.setItem("sama_user", JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
    showToast(`مرحباً بك ${userData.name} في سما الخضراء للهواتف! 👋`);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      if (user) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, userEmail: user.email }),
        });
      }
    } catch (e) {
      console.error("Logout API error:", e);
    }
    setUser(null);
    setCurrentRole("BUYER");
    try {
      localStorage.removeItem("sama_user");
    } catch (e) {
      console.error(e);
    }
    showToast("تم تسجيل الخروج بنجاح");
  };

  // Guest session state to avoid cross-user cart collisions
  const [guestId, setGuestId] = useState<string>("guest_buyer");

  useEffect(() => {
    try {
      let storedGuestId = localStorage.getItem("sama_guest_id");
      if (!storedGuestId) {
        storedGuestId = `guest_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
        localStorage.setItem("sama_guest_id", storedGuestId);
      }
      setGuestId(storedGuestId);
    } catch (e) {
      console.error("Failed to load guestId:", e);
    }
  }, []);

  const userId = user
    ? user.id
    : currentRole === "SELLER"
    ? "demo-seller-user-id"
    : currentRole === "ADMIN"
    ? "demo-admin-id"
    : guestId;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/cart?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        setSummary(
          data.summary || {
            totalItems: 0,
            subtotal: 0,
            taxAmount: 0,
            shippingFee: 0,
            totalAmount: 0,
          }
        );
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [userId]);

  const addToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("تمت إضافة المنتج إلى السلة بنجاح! 🛍️");
        await refreshCart();
        setIsCartOpen(true);
        return true;
      } else {
        showToast(data.error || "تعذر إضافة المنتج للسلة");
        return false;
      }
    } catch (e) {
      showToast("حدث خطأ أثناء الإضافة للسلة");
      return false;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshCart();
      } else {
        showToast(data.error || "تعذر تحديث الكمية");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}&userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("تم حذف المنتج من السلة");
        await refreshCart();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`/api/cart?clearAll=true&userId=${userId}`, {
        method: "DELETE",
      });
      await refreshCart();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems: summary.totalItems,
        subtotal: summary.subtotal,
        taxAmount: summary.taxAmount,
        shippingFee: summary.shippingFee,
        totalAmount: summary.totalAmount,
        isLoading,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(!isCartOpen),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        currentRole,
        setCurrentRole,
        userId,
        toastMessage,
        showToast,

        // Auth
        user,
        isAuthenticated: !!user,
        isAuthModalOpen: false,
        openAuthModal: () => {},
        closeAuthModal: () => {},
        login,
        logout,

        // Menu Drawer
        isMenuOpen,
        openMenu: () => setIsMenuOpen(true),
        closeMenu: () => setIsMenuOpen(false),
        toggleMenu: () => setIsMenuOpen(!isMenuOpen),

        // Installments
        purchaseType,
        setPurchaseType,
        installmentMonths,
        setInstallmentMonths,
        downPayment,
        setDownPayment,

        // Wishlist
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
