import useStore from "../store/useStore";

export default function Cart() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useStore();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty 🛒</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
            <img src={item.image} className="h-16 w-16 object-contain" />
            <div className="flex-1 px-4">
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-500">{item.price}$</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ❌
            </button>
          </div>
        ))
      )}
    </div>
  );
}
