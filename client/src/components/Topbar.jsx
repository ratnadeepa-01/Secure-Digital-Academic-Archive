import { Search, Moon, Sun, Bell, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Topbar({ role }) {
  const { theme, toggleTheme } = useTheme();
  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const token = localStorage.getItem("token") || "";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotifications();

    // Setup polling every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id, link) => {
    try {
      await axios.patch(`http://localhost:3000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setShowNotifications(false);
      if (link) navigate(link);
    } catch (err) {
      console.log(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-theme-surface border-b border-theme px-8 py-3.5 flex items-center justify-between">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3" />
        <input
          type="text"
          placeholder="Search anything..."
          className="input-field input-field-icon pr-4 py-2 rounded-xl text-sm"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5 ml-6">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-theme-border-soft text-theme-2 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-theme-surface shadow-sm animate-pulse" />
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-theme-surface border border-theme shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-theme flex items-center justify-between bg-theme-bg/50">
                <h3 className="font-bold text-sm tracking-tight text-theme">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
                    <CheckCircle2 size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto overscroll-contain">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => markAsRead(notif._id, notif.link)}
                      className={`p-4 border-b border-theme last:border-0 cursor-pointer transition-colors flex gap-3 ${
                        notif.isRead ? "hover:bg-theme-bg/80" : "bg-brand-soft hover:bg-brand-soft/80"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${notif.isRead ? "text-theme-2" : "text-theme font-semibold"}`}>
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-theme-3 mt-1.5 font-bold uppercase tracking-widest">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-theme-3">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-theme-border-soft text-theme-2 transition-all"
          title={theme === "light" ? "Switch to dark" : "Switch to light"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User pill */}
        <div className="flex items-center gap-3 pl-5 border-l border-theme">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-theme leading-tight">{name}</p>
            <p className="text-[11px] text-brand font-semibold uppercase tracking-wide">{role}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-soft2 border border-theme flex items-center justify-center text-brand text-sm font-bold flex-shrink-0">
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;