import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import useStore from "../store/useStore";
import { FaShoppingCart, FaBoxOpen, FaPlus, FaUserCircle, FaUserShield } from "react-icons/fa";
import { SiShopify } from "react-icons/si";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Navbar() {
  const { currentUser, role, logout } = useAuthStore();
  const orders = useStore((state) => state.orders);
  const cart = useStore((state) => state.cart);
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const isLoginPage = location.pathname === "/login";
  // const isRegisterPage = location.pathname === "/register";
  const isAdminPage = location.pathname === "/admin";

  const cartCount = role === "user" ? cart.length : 0;

  // orderCount دائمًا رقم
  const orderCount = currentUser
    ? orders.filter((order) => {
        if (role === "user") return order.user === currentUser;
        if (role === "admin") {
          return order.items.some(
            (item) => item.adminUsername === currentUser || !item.adminUsername
          );
        }
        return false;
      }).length
    : 0;

  const navItemStyle =
    "flex items-center gap-2 px-3 py-2  rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer font-medium";

  // أيقونة المستخدم أو الأدمن
  const userIcon = role === "admin" ? <FaUserShield /> : <FaUserCircle />;

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center relative">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl hover:text-blue-600 transition"
        >
          <SiShopify className="text-blue-600 text-2xl" />
          MyShop
        </Link>

        {currentUser && (
          <div className="flex items-center gap-2 px-3 py-2  bg-gray-100 rounded-full text-gray-800 font-medium">
          <span className="text-blue-600">{userIcon}</span>  
            {currentUser}
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {role === "admin" && currentUser && (
          <Link to="/admin" className={navItemStyle}>
            <div
              className={`w-2.5 h-2.5 rounded-full transition ${
                isAdminPage ? "bg-blue-600" : "bg-gray-400"
              }`}
            ></div>
            <MdAdminPanelSettings />
            Dashboard
          </Link>
        )}

        {role === "user" && currentUser && (
          <Link to="/cart" className={`relative ${navItemStyle}`}>
            <FaShoppingCart />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {currentUser && (
          <Link to="/orders" className={`relative ${navItemStyle}`}>
            <FaBoxOpen />
            Orders
            {orderCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {orderCount}
              </span>
            )}
          </Link>
        )}

        {!currentUser ? (
          isLoginPage ? (
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Register
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Login
            </Link>
          )
        ) : (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="text-2xl text-gray-700 hover:text-blue-600 transition"
        >
          <FaPlus />
        </button>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="absolute top-16 right-4 bg-white shadow-xl rounded-xl p-5 flex flex-col gap-2 w-56 md:hidden z-50">
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-gray-700 font-medium mb-2">
             <span className="text-blue-600">{userIcon}</span> 
              {currentUser}
            </div>
          )}

          {role === "admin" && currentUser && (
            <Link
              to="/admin"
              onClick={() => setOpenMenu(false)}
              className={navItemStyle}
            >
              <MdAdminPanelSettings />
              Dashboard
            </Link>
          )}

          {role === "user" && currentUser && (
            <Link
              to="/cart"
              onClick={() => setOpenMenu(false)}
              className={navItemStyle}
            >
              <FaShoppingCart />
              Cart
            </Link>
          )}

          {currentUser && (
            <Link
              to="/orders"
              onClick={() => setOpenMenu(false)}
              className={navItemStyle}
            >
              <FaBoxOpen />
              Orders
            </Link>
          )}

          {!currentUser ? (
            isLoginPage ? (
              <Link
                to="/register"
                onClick={() => setOpenMenu(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center cursor-pointer"
              >
                Register
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpenMenu(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center cursor-pointer"
              >
                Login
              </Link>
            )
          ) : (
            <button
              onClick={() => {
                logout();
                setOpenMenu(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mt-2 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
