import { useState } from "react";
import type { Product } from "../types/Product";

interface Props {
  product: Product;
  categories: string[];
  onUpdate: (id: number, data: Partial<Product>) => void;
  onDelete: (id: number) => void;
}

const AdminProductCard: React.FC<Props> = ({ product, categories, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: product.price.toString(),
    image: product.image,
    category: product.category
  });

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition relative flex flex-col">
      {isEditing ? (
        <div className="space-y-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onUpdate(product.id, {
                  title: form.title,
                  description: form.description,
                  price: parseFloat(form.price),
                  image: form.image,
                  category: form.category
                });
                setIsEditing(false);
              }}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <img
            src={product.image}
            alt={product.title}
            className="h-48 w-full object-contain rounded mb-2"
          />

          <h3 className="font-semibold text-lg line-clamp-2">
            {product.title}
          </h3>

          <p className="text-gray-500 text-sm line-clamp-3">
            {product.description}
          </p>

          <p className="text-blue-600 font-bold text-lg mt-1">
            ${product.price}
          </p>

          <p className="text-gray-400 text-sm mb-2">
            {product.category}
          </p>

          <div className="flex gap-2 mt-auto pt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(product.id)}
              className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </>

      )}
    </div>
  );
};

export default AdminProductCard;
