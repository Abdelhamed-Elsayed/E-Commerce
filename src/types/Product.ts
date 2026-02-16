// types/Product.ts
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  storeName: string | null;      // ممكن تكون null
  adminUsername: string | null;  // ممكن تكون null
}
