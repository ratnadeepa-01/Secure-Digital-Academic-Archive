import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  LogOut,
  Users,
  BookOpen
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
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(path)
      ? "bg-white/10 text-white"
      : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div
      className="w-60 flex-shrink-0 flex flex-col"
      style={{ background: "#1a1d2e", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">SDAA</p>
            <p className="text-gray-500 text-xs leading-tight">Digital Academic Archive</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {role === "student" && (
          <>
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link to="/my-submissions" className={navLinkClass("/my-submissions")}>
              <FileText size={16} />
              My Submissions
            </Link>
          </>
        )}

        {role === "staff" && (
          <>
            <Link to="/staff" className={navLinkClass("/staff")}>
              <LayoutDashboard size={16} />
              Review
            </Link>
            <Link to="/create-assignment" className={navLinkClass("/create-assignment")}>
              <BookOpen size={16} />
              New Assignment
            </Link>
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {role === "student" && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Users size={16} />
            Switch to Staff
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;