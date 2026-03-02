function Topbar({ role }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">
        {role === "student" ? "Student Portal" : "Staff Portal"}
      </h1>

      <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
        {role?.toUpperCase()}
      </span>
    </div>
  );
}

export default Topbar;