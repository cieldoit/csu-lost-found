import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { LogOut, LayoutDashboard, PlusCircle, Search, User, Shield, Bell } from "lucide-react";
import API from "../api/api";

function Navbar() {
  const { user, logout, token } = useAuthStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    if (token) {
      fetchNotifications();
      // Optional: Polling can be added here if real-time is necessary
    }
  }, [token]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleNotifications = async () => {
    const newShow = !showNotifications;
    setShowNotifications(newShow);

    if (newShow && unreadCount > 0) {
      // Mark as read in UI instantly
      setNotifications(prev => prev.map(n => ({...n, read: true})));
      try {
        await API.put("/notifications/read", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }
  };

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 px-6 py-4 mx-4 mt-4 rounded-2xl flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <Search className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight gradient-text hidden sm:block">ASA Lost & Found</span>
      </Link>

      <div className="hidden lg:flex items-center gap-6">
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
        {user?.role === 'admin' && (
          <Link to="/admin" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors">
            <Shield size={18} />
            Admin Panel
          </Link>
        )}
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
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={handleToggleNotifications}
              className="relative p-2.5 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-14 right-[-50px] sm:right-0 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden animate-fade-in origin-top-right">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notif) => (
                        <div key={notif._id} className="p-4 hover:bg-slate-50 transition-colors">
                          <p className="text-sm font-medium text-slate-700 leading-snug">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1.5 font-medium">
                            {new Date(notif.createdAt).toLocaleDateString(undefined, {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 px-4 text-center">
                      <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="flex items-center gap-3 bg-slate-100/50 px-3 py-1.5 rounded-full">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User size={16} className="text-primary" />
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.fullName.split(" ")[0]}</span>
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
