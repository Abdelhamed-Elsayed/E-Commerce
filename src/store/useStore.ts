import { create } from "zustand";
import type { Product } from "../types/Product";
import type { CartItem } from "../types/CartItem";
import type { Order } from "../types/Order";
import { getProducts, getCategories } from "../api/productApi";

interface StoreState {
  apiProducts: Product[];
  adminProducts: Product[];
  cart: CartItem[];
  orders: Order[];
  categories: string[];

  loadApiProducts: () => Promise<void>;
  loadCategories: () => Promise<void>;

  addAdminProduct: (p: Product) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  deleteAdminProduct: (id: number) => void;

  addToCart: (product: Product, qty: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;

  checkout: (selectedItems?: CartItem[]) => void;
  clearCart: (selectedIds?: number[]) => void;

  setOrderStatus: (id: number, status: "pending" | "delivered") => void;
  deleteOrder: (id: number) => void;
}

const useStore = create<StoreState>((set, get) => {
  const currentUser = localStorage.getItem("currentUser") || "";

  const storedAdminProducts: Product[] = JSON.parse(localStorage.getItem("admin-products") || "[]").map((p: any) => ({
    ...p,
    adminUsername: p.adminUsername || "",
    storeName: p.storeName || ""
  }));

  const storedCart: CartItem[] = JSON.parse(localStorage.getItem(`cart-${currentUser}`) || "[]");
  const storedOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");

  return {
    apiProducts: [],
    adminProducts: storedAdminProducts,
    cart: storedCart,
    orders: storedOrders,
    categories: [],

    loadApiProducts: async () => {
      const data = await getProducts();
      set({ apiProducts: data });
    },

    loadCategories: async () => {
      const cats = await getCategories();
      set({ categories: cats });
    },

    addAdminProduct: (p) => {
      const newProduct: Product = {
        ...p,
        storeName: p.storeName || "Admin Store",
        adminUsername: p.adminUsername || currentUser
      };
      const updated = [...get().adminProducts, newProduct];
      localStorage.setItem("admin-products", JSON.stringify(updated));
      set({ adminProducts: updated });
    },

    updateProduct: (id, data) => {
      const updated = get().adminProducts.map(p => p.id === id ? { ...p, ...data } : p);
      localStorage.setItem("admin-products", JSON.stringify(updated));
      set({ adminProducts: updated });
    },

    deleteAdminProduct: (id) => {
      const updated = get().adminProducts.filter(p => p.id !== id);
      localStorage.setItem("admin-products", JSON.stringify(updated));
      set({ adminProducts: updated });
    },

    addToCart: (product, qty) => {
      const exist = get().cart.find(i => i.id === product.id);
      let updated;
      if (exist) {
        updated = get().cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      } else {
        updated = [...get().cart, { ...product, quantity: qty }];
      }
      localStorage.setItem(`cart-${currentUser}`, JSON.stringify(updated));
      set({ cart: updated });
    },

    increaseQuantity: (id) => {
      const updated = get().cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      localStorage.setItem(`cart-${currentUser}`, JSON.stringify(updated));
      set({ cart: updated });
    },

    decreaseQuantity: (id) => {
      const updated = get().cart.map(i => i.id === id ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : 1 } : i);
      localStorage.setItem(`cart-${currentUser}`, JSON.stringify(updated));
      set({ cart: updated });
    },

    removeFromCart: (id) => {
      const updated = get().cart.filter(i => i.id !== id);
      localStorage.setItem(`cart-${currentUser}`, JSON.stringify(updated));
      set({ cart: updated });
    },

    checkout: (selectedItems) => {
      const itemsToCheckout = selectedItems || get().cart;
      if (itemsToCheckout.length === 0) return;

      const total = itemsToCheckout.reduce((s, i) => s + i.price * i.quantity, 0);
      const order: Order = {
        id: Date.now(),
        items: itemsToCheckout,
        total,
        status: "pending",
        user: currentUser,
        storeName: "",
        admins: undefined
      };

      const updatedOrders = [...get().orders, order];
      const updatedCart = get().cart.filter(i => !itemsToCheckout.includes(i));

      set({ orders: updatedOrders, cart: updatedCart });
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      localStorage.setItem(`cart-${currentUser}`, JSON.stringify(updatedCart));
    },

    clearCart: (selectedIds) => {
      if (!selectedIds) {
        set({ cart: [] });
        localStorage.setItem(`cart-${currentUser}`, JSON.stringify([]));
      } else {
        const updated = get().cart.filter(i => !selectedIds.includes(i.id));
        set({ cart: updated });
        localStorage.setItem(`cart-${currentUser}`, JSON.stringify(updated));
      }
    },

    setOrderStatus: (id, status) => {
      const updated = get().orders.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem("orders", JSON.stringify(updated));
      set({ orders: updated });
    },

    deleteOrder: (id) => {
      const updated = get().orders.filter(o => o.id !== id);
      localStorage.setItem("orders", JSON.stringify(updated));
      set({ orders: updated });
    }
  };
});

export default useStore;
