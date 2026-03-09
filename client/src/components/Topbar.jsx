import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Topbar({ role }) {
  const { theme, toggleTheme } = useTheme();
  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border px-8 py-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-gray-50 dark:bg-dark-bg border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all"
           />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-6">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border text-gray-500 dark:text-gray-400 transition-all"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="flex items-center gap-3 border-l border-gray-100 dark:border-dark-border pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{name}</p>
            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-tighter">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-bold flex-shrink-0 border border-primary-200 dark:border-primary-800">
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;