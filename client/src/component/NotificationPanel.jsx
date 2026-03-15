import { useState, useEffect } from "react";
import API from "../api/api";
import useAuthStore from "../store/authStore";
import { Bell } from "lucide-react";

function NotificationPanel() {
  const token = useAuthStore((state) => state.token);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Bell className="text-primary w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Updates</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <p className="text-sm font-semibold text-slate-700 leading-snug">
                  {notif.message}
                </p>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {new Date(notif.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center justify-center h-full py-10 opacity-60">
            <Bell size={32} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium text-sm">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
