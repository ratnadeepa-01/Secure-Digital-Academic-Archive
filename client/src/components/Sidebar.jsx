import { Link, useNavigate } from "react-router-dom";

function Sidebar({ role }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10">SDAA</h2>

        <nav className="space-y-4">
          <Link to="/dashboard" className="block hover:bg-indigo-700 px-4 py-2 rounded-lg">
            Dashboard
          </Link>

          {role === "staff" && (
            <Link to="/staff" className="block hover:bg-[#c4b5fd] rounded-lg">
              Review
            </Link>
          )}
        </nav>
      </div>

      <button
        onClick={logout}
        className="w-64 bg-[#dcd6f7] text-gray-800 p-6 flex flex-col justify-between">
        Logout
      </button>
    </div>
  );
}

export default Sidebar;