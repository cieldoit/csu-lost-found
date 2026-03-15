import { useState, useEffect } from "react";
import { Search } from "lucide-react";

function SearchBar({ onSearch, placeholder = "Search items..." }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // Allow immediate execution when pressing enter
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full lg:w-96 shrink-0 self-center lg:self-auto">
      <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
        <Search size={20} />
      </button>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium text-[15px] placeholder:font-medium placeholder:text-slate-400 text-slate-700"
      />
    </form>
  );
}

export default SearchBar;
