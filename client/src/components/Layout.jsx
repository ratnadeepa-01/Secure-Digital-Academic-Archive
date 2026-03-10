import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children }) {
  const role = localStorage.getItem("role");

  return (
    <div className="flex h-screen overflow-hidden bg-theme-bg">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar role={role} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;