import useStore from "../store/useStore";

export default function AdminOrders() {
  const { orders, setOrderStatus, deleteOrder } = useStore();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Orders</h1>

      {orders.map(order => (
        <div key={order.id} className="bg-white p-4 rounded shadow">
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>

          <div className="flex gap-3 mt-3">
            {order.status === "pending" && (
              <button
                onClick={() => setOrderStatus(order.id, "delivered")}
                className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                Done
              </button>
            )}

            <button
              onClick={() => deleteOrder(order.id)}
              className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
