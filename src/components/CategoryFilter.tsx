interface Props {
  categories: string[];
  onSelect: (value: string) => void;
}

const CategoryFilter: React.FC<Props> = ({ categories, onSelect }) => {
  return (
    <div className="relative w-60 ">
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm appearance-none bg-white cursor-pointer "
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        ▼
      </span>
    </div>
  );
};

export default CategoryFilter;
