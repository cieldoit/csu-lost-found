import useAuthStore from "../store/authStore";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Clock, CheckCircle, AlertTriangle, ArrowRight, Package } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../api/api";
import RecentItems from "../component/RecentItems";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [stats, setStats] = useState({ lost: 0, found: 0, claimed: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
       try {
         const res = await API.get("/items/recent", { headers: { Authorization: `Bearer ${token}` }});
         const items = res.data;
         
         // Mock stats derived from recent items for visual feedback
         const lostCount = items.filter(i => i.type === 'lost').length;
         const foundCount = items.filter(i => i.type === 'found').length;
         setStats({ lost: lostCount, found: foundCount, claimed: 0 });
         
       } catch (error) {
         console.error("Failed to fetch dashboard data", error);
       }
    };

    fetchDashboardData();
  }, [token]);

  const statCards = [
    { title: "Lost Items", count: stats.lost, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Found Items", count: stats.found, icon: Search, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Recovered", count: stats.claimed, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Welcome back, <span className="gradient-text">{user?.fullName?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 text-lg">Here's what's happening with your reported items.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/report-lost" className="btn-primary flex items-center gap-2">
            <PlusCircle size={20} />
            Report Lost
          </Link>
          <Link to="/report-found" className="btn-secondary flex items-center gap-2">
            <Search size={20} />
            Report Found
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={stat.title}
            className="glass-card p-6 rounded-3xl flex items-center gap-5 hover:scale-[1.02] transition-transform animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-slate-500 font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Recent Items Module */}
        <div className="w-full">
          <RecentItems />
        </div>
      </div>

      {/* Quick Tips / Info Section */}
      <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">How to recover items faster?</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Adding clear photos and specific locations significantly increases the chance of finding your item. 
            Our automated matching system will notify you as soon as a potential match is found.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm">
              <Clock size={16} /> Update daily
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm">
              <CheckCircle size={16} /> Verify ownership
            </div>
          </div>
        </div>
        <Search className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
      </div>
    </div>
  );
}

export default Dashboard;