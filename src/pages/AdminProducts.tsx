import { useEffect, useState } from "react";
import useStore from "../store/useStore";
import AdminProductCard from "../components/AdminProductCard";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const currentUser = localStorage.getItem("currentUser") || "";
  const { adminProducts, addAdminProduct, updateProduct, deleteAdminProduct, categories, loadCategories } = useStore();

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: ""
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddProduct = () => {
    const { title, description, price, image, category } = newProduct;

    if (!title || !description || !price || !image || !category) {
      toast.error("Please fill all fields");
      return;
    }

    addAdminProduct({
      id: Date.now(),
      title,
      description,
      price: +price,
      image,
      category,
      adminUsername: currentUser,
      storeName: "Admin Store"
    });

    setNewProduct({ title: "", description: "", price: "", image: "", category: "" });
    toast.success("Product added");
  };

  const myProducts = adminProducts.filter(p => p.adminUsername === currentUser);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Control Products</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <input placeholder="Title" value={newProduct.title}
          onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
          className="border p-2 rounded w-full" />

        <input placeholder="Description" value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border p-2 rounded w-full" />

        <input type="number" placeholder="Price" value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-2 rounded w-full" />

        <input placeholder="Image URL" value={newProduct.image}
          onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
          className="border p-2 rounded w-full" />

        <select value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
          className="border p-2 rounded w-full">
          <option value="">Select Category</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <button onClick={handleAddProduct}
          className="bg-green-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {myProducts.map(p => (
          <AdminProductCard
            key={p.id}
            product={p}
            categories={categories}
            onUpdate={updateProduct}
            onDelete={(id) => {
              deleteAdminProduct(id);
              toast.success("Product deleted");
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
