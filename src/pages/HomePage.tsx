import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useStore from "../store/useStore";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

const HomePage: React.FC = () => {
  const { apiProducts, loadApiProducts, adminProducts } = useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    loadApiProducts();
  }, []);

  // فلترة المنتجات حسب البحث والفئة
  const filtered = [...apiProducts, ...adminProducts].filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? p.category === category : true)
  );

  // toast alert لو مفيش منتجات بعد الفلترة
  useEffect(() => {
    if (filtered.length === 0) {
      toast.error("No products found 🔍");
    }
  }, [filtered]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <SearchBar onSearch={setSearch} />
      <CategoryFilter
        categories={[...new Set([...apiProducts.map(p => p.category), ...adminProducts.map(p => p.category)])]}
        onSelect={setCategory}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No products found 🔍</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
