import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Topbar({ role }) {
  const { theme, toggleTheme } = useTheme();
  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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