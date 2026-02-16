import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import AdminProducts from "./pages/AdminProducts";
import OrderPage from "./pages/OrderPage";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Router>

      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
