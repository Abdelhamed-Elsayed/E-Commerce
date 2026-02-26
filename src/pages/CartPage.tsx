import useStore from "../store/useStore";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    checkout,
  } = useStore();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const clearSelection = () => {
    if (selectedIds.length === 0) {
      toast.dismiss();
      toast.error("No items selected to clear!");
      return;
    }

    selectedIds.forEach(id => removeFromCart(id)); 
    setSelectedIds([]);
    toast.dismiss();
    toast.success("Selected items cleared!");
  };

  const handleClearCart = () => {
    if (cart.length === 0) {
      toast.dismiss();
      toast.error("Cart is already empty!");
      return;
    }
    clearCart();
    setSelectedIds([]);
    toast.dismiss();
    toast.success("Cart cleared!");
  };

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      toast.dismiss();
      toast.error("Please select at least one product to checkout!");
      return;
    }

    const selectedItems = cart.filter(item => selectedIds.includes(item.id));
    checkout(selectedItems);
    setSelectedIds([]);
    toast.dismiss();
    toast.success("Checkout successful!");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          Your cart is empty.{" "}
          <Link to="/" className="text-blue-600 underline">
            Go shopping
          </Link>
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {cart.map(item => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-md transition gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="cursor-pointer"
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 sm:w-16 sm:h-16 object-contain rounded bg-gray-100"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold line-clamp-2">{item.title}</h2>
                    <p className="text-blue-600 font-semibold">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400 transition cursor-pointer font-semibold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-gray-200 rounded">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400 transition cursor-pointer font-semibold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    toast.dismiss();
                    toast.success("Item removed from cart!");
                  }}
                  className="mt-2 sm:mt-0 px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700 transition cursor-pointer font-semibold"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
              {selectedIds.length > 0 && (
                <div className="px-3 py-1 bg-blue-600 text-white rounded-full font-semibold">
                  Selected: {selectedIds.length}
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition font-semibold cursor-pointer"
              >
                Clear Items
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-red-700 hover:text-white transition font-semibold cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
