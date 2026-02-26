import type { Product } from "../types/Product";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useState } from "react";
import useStore from "../store/useStore";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col ">
      <Link to={`/product/${product.id}`} className="flex-1">
        <img
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-contain mb-4 "
        />
        <h3 className="font-medium text-sm line-clamp-2 mb-2 ">
          {product.title}
        </h3>
        <p className="text-blue-600 font-semibold ">
          ${product.price}
        </p>
      </Link>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={decrease}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
        >
          -
        </button>
        <span className="px-3 py-1 border rounded text-center w-12">{quantity}</span>
        <button
          onClick={increase}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
        >
          +
        </button>
      </div>

      <Button
        onClick={() => addToCart(product, quantity)}
        className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductCard;
