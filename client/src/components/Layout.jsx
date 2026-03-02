import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children }) {
  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar role={role} />

      <div className="flex-1 p-10">
        <Topbar role={role} />
        {children}
      </div>
    </div>
  );
}

export default Layout;