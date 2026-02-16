import type { CartItem } from "./CartItem";

export interface Order {
  admins: any;
  user: string | null;
  id: number;
  items: CartItem[];
  total: number;
  status: "pending" | "delivered";
  storeName: string;
}
