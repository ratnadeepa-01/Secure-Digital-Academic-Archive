function Topbar({ role }) {
  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700">
        {role === "student" ? "Student Portal" : "Staff Portal"}
      </span>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {role}
        </span>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{name}</p>
          {email && (
            <p className="text-xs text-gray-400 leading-tight">{email}</p>
          )}
        </div>
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {initials}
        </div>
      </div>
    </div>
  );
}

export default Topbar;