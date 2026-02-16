import { useParams } from "react-router-dom";
import { useState } from "react";
import useStore from "../store/useStore";

export default function ProductDetails() {
  const { id } = useParams();
  const { apiProducts, adminProducts, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);

  const allProducts = [...apiProducts, ...adminProducts];
  const product = allProducts.find(p => p.id === Number(id));

  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} item(s) added to cart!`);
  };

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.image}
        className="h-80 object-contain cursor-pointer"
        alt={product.title}
      />

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-semibold">${product.price}</p>

        {/* Quantity selector with + and - */}
        <div className="flex items-center gap-2">
          <button
            onClick={decrease}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="px-4 py-1 border rounded text-center w-12">{quantity}</span>
          <button
            onClick={increase}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
