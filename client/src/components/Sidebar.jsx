import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  LogOut,
  Users,
  BookOpen,
  Settings,
  Bell
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
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(path)
      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
      : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border dark:hover:text-gray-200"
    }`;

  return (
    <div
      className="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border transition-colors duration-200"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-indigo-500/20 shadow-lg">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-bold text-lg leading-tight tracking-tight">Dabang</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">SDAA Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
        
        {role === "student" && (
          <>
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link to="/my-submissions" className={navLinkClass("/my-submissions")}>
              <FileText size={18} />
              My Submissions
            </Link>
          </>
        )}

        {role === "staff" && (
          <>
            <Link to="/staff" className={navLinkClass("/staff")}>
              <LayoutDashboard size={18} />
              Review
            </Link>
            <Link to="/create-assignment" className={navLinkClass("/create-assignment")}>
              <BookOpen size={18} />
              New Assignment
            </Link>
          </>
        )}

        <div className="pt-6">
           <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">System</p>
           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-all">
              <Settings size={18} />
              Settings
           </button>
           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-all">
              <Bell size={18} />
              Notifications
           </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-6 border-t border-gray-100 dark:border-dark-border space-y-2">
        {role === "student" && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-all"
          >
            <Users size={18} />
            Switch to Staff
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;