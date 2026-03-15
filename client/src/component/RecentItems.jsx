import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import ItemCard from "./ItemCard";
import { ArrowRight, Package } from "lucide-react";

function RecentItems() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const res = await API.get("/items/recent");
        setRecentItems(res.data);
      } catch (error) {
        console.error("Failed to fetch recent items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <div className="space-y-6 flex-1">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Recently Updated</h2>
        <Link to="/lost-items" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          Explore All <ArrowRight size={18} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : recentItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-3xl text-center flex flex-col items-center justify-center group animate-fade-in h-[300px]">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <Package size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No items reported yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-6">
            Keep track of your lost and found belongings by reporting them here.
          </p>
          <Link to="/report-lost" className="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1">
            Start by reporting a lost item
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecentItems;
