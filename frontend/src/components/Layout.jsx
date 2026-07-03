import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Home, FileText, PlusCircle, CheckCircle, User } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const employeeLinks = [
    { name: "Dashboard", path: "/employee/dashboard", icon: Home },
    { name: "Apply Leave", path: "/employee/apply", icon: PlusCircle },
    { name: "Leave History", path: "/employee/history", icon: FileText },
    { name: "Profile", path: "/employee/profile", icon: User },
  ];

  const managerLinks = [
    { name: "Dashboard", path: "/manager/dashboard", icon: Home },
    { name: "Pending Approvals", path: "/manager/approvals", icon: CheckCircle },
    { name: "Profile", path: "/manager/profile", icon: User },
  ];

  const links = user?.role === "MANAGER" ? managerLinks : employeeLinks;

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-indigo-600">LMS System</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="text-gray-500 font-medium">
        Welcome back, <span className="text-gray-900">{user?.name}</span>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
      >
        <LogOut size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
