import useStore from "../store/useStore";
import useAuthStore from "../store/useAuthStore";
import Button from "../components/Button";
import toast from "react-hot-toast";

const OrderPage: React.FC = () => {
  const { orders, setOrderStatus, deleteOrder } = useStore();
  const { role, currentUser } = useAuthStore();

  // فلترة الأوردرات حسب الدور
  const filteredOrders = orders.filter(order => {
    if (role === "admin") {
      // منتجات الأدمن داخل الأوردر
      const myItems = order.items.filter(item => item.adminUsername === currentUser);
      // لو عنده منتجات في الأوردر يرجعهم، لو مش عنده يشوف كل المنتجات (API products)
      return myItems.length > 0 || order.items.some(item => !item.adminUsername);
    }
    if (role === "user") {
      return order.user === currentUser;
    }
    return false;
  });

  const handleCancelOrder = (id: number) => {
    deleteOrder(id);
    toast.success("Order cancelled successfully!");
  };

  const handleDelivered = (id: number) => {
    setOrderStatus(id, "delivered");
    // تحديث localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = storedOrders.map((o: any) =>
      o.id === id ? { ...o, status: "delivered" } : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("Order marked as delivered!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold cursor-default">Orders</h1>

      {filteredOrders.length === 0 ? (
        <div className="text-center mt-20 text-gray-500 cursor-default">
          No orders yet
        </div>
      ) : (
        filteredOrders.map(order => {
          const visibleItems =
            role === "admin"
              ? order.items.filter(item => item.adminUsername === currentUser || !item.adminUsername)
              : order.items;

          return (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow space-y-4">
              
              {/* STATUS */}
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status === "pending" ? "Pending" : "Completed"}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-2">
                {visibleItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.image} className="h-16 w-16 object-contain rounded" />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.title}</p>
                      <p className="text-gray-500 text-md">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                {role === "admin" && order.status === "pending" && (
                  <Button
                    onClick={() => handleDelivered(order.id)}
                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  >
                    Make as Delivered
                  </Button>
                )}

                {role === "admin" && order.status === "delivered" && (
                  <Button
                    onClick={() => {
                      deleteOrder(order.id);
                      toast.success("Order deleted!");
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    Delete Order
                  </Button>
                )}

                {role === "user" && order.status === "pending" && (
                  <Button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderPage;
