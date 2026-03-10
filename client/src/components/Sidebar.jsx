import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, BookOpen,
  Settings, Bell, LogOut, Users
} from "lucide-react";

function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive(path)
        ? "bg-brand text-white shadow-sm"
        : "text-theme-2 hover:bg-theme-border-soft hover:text-theme"
    }`;

  return (
    <div
      className="w-64 flex-shrink-0 flex flex-col bg-theme-sidebar border-r border-theme"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-sm">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-theme font-bold text-base leading-tight">Dabang</p>
            <p className="text-theme-3 text-xs">SDAA Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-theme-3 uppercase tracking-widest mb-3">
          Main Menu
        </p>

        {role === "student" && (
          <>
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              <LayoutDashboard size={17} /> Dashboard
            </Link>
            <Link to="/my-submissions" className={navLinkClass("/my-submissions")}>
              <FileText size={17} /> My Submissions
            </Link>
          </>
        )}

        {role === "staff" && (
          <>
            <Link to="/staff" className={navLinkClass("/staff")}>
              <LayoutDashboard size={17} /> Review
            </Link>
            <Link to="/create-assignment" className={navLinkClass("/create-assignment")}>
              <BookOpen size={17} /> New Assignment
            </Link>
          </>
        )}

        <div className="pt-6">
          <p className="px-4 text-[10px] font-bold text-theme-3 uppercase tracking-widest mb-3">
            System
          </p>
          <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-theme-2 hover:bg-theme-border-soft hover:text-theme transition-all">
            <Settings size={17} /> Settings
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-theme-2 hover:bg-theme-border-soft hover:text-theme transition-all">
            <Bell size={17} /> Notifications
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-5 border-t border-theme space-y-1">
        {role === "student" && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-theme-2 hover:bg-theme-border-soft hover:text-theme transition-all"
          >
            <Users size={17} /> Switch to Staff
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;