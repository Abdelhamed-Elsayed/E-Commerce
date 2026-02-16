import axios from "axios";
import { type Product } from "../types/Product";

const BASE_URL = "https://fakestoreapi.com";

export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(`${BASE_URL}/products`);
  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await axios.get<Product>(`${BASE_URL}/products/${id}`);
  return res.data;
};

export const getCategories = async (): Promise<string[]> => {
  const res = await axios.get<string[]>(`${BASE_URL}/products/categories`);
  return res.data;
};
