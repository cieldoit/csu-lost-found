import { useState, useEffect } from "react";
import API from "../api/api";
import ItemCard from "../component/ItemCard";
import SearchBar from "../component/SearchBar";
import { AlertCircle, Tag, Filter } from "lucide-react";

function LostItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchLostItems = async () => {
      setLoading(true);
      try {
        const params = { type: "lost" };
        if (query) params.q = query;
        if (category) params.category = category;
        if (status) params.status = status;

        const res = await API.get("/items/search", { params });
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch lost items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, [query, category, status]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="mb-10 text-center lg:text-left flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight lg:tracking-tighter mb-4">
            Lost Items Directory
          </h1>
          <p className="text-[17px] text-slate-500 font-medium max-w-3xl leading-relaxed">
            Browse through items reported lost across the campus. 
            If you have found any of these items, please help by turning them in or contacting the owner.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 w-full lg:w-auto mt-6 lg:mt-0">
          <SearchBar onSearch={handleSearch} placeholder="Search lost items..." />
          <div className="flex gap-4 lg:self-end">
            <div className="relative">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium text-slate-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Personal Effects">Personal Effects</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div className="relative">
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium text-slate-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="claimed">Claimed</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-2xl flex items-center gap-3 font-semibold text-lg max-w-2xl mx-auto shadow-sm">
          <AlertCircle size={28} className="text-red-500 shrink-0" />
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 text-center py-20 px-8 rounded-4xl max-w-3xl mx-auto flex flex-col items-center">
          <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-emerald-100/50 shadow-inner">
            <Tag size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No lost items reported</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
            Looks like everyone is keeping track of their belongings! Check back later or report an item if you lost one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LostItems;
