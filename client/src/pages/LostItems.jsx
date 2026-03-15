import { useState, useEffect } from "react";
import API from "../api/api";
import ItemCard from "../component/ItemCard";
import { AlertCircle, Tag, Search } from "lucide-react";

function LostItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const res = await API.get("/items/lost");
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch lost items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

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
        
        <div className="relative w-full lg:w-96 shrink-0 self-center lg:self-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search lost items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-[15px] placeholder:font-medium placeholder:text-slate-400 text-slate-700"
          />
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
          {items
            .filter(item => 
              item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              item.locationLost?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LostItems;
