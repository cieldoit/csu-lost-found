import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { LogOut, LayoutDashboard, PlusCircle, Search, User } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 px-6 py-4 mx-4 mt-4 rounded-2xl flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <Search className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight gradient-text">ASA Lost & Found</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link to="/lost-items" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors">
          <Search size={18} />
          Lost Items
        </Link>
        <Link to="/found-items" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors">
          <Search size={18} />
          Found Items
        </Link>
        <Link to="/report-lost" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors">
          <PlusCircle size={18} />
          Report Lost
        </Link>
        <Link to="/report-found" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors">
          <PlusCircle size={18} />
          Report Found
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 bg-slate-100/50 px-3 py-1.5 rounded-full">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User size={16} className="text-primary" />
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.fullName}</span>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="p-2.5 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
