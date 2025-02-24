import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoHome, IoSettings, IoMenu, IoLogOut } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/dashboard", icon: IoHome, label: "Dashboard" },
    { path: "/tasks", icon: FaTasks, label: "Tasks" },
    { path: "/groups", icon: HiUserGroup, label: "Groups" },
    { path: "/settings", icon: IoSettings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo or Brand */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm
                  rounded-lg transition-colors duration-200
                  ${
                    isActivePath(item.path)
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <IoLogOut className="w-5 h-5" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                <IoMenu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 ml-4 md:ml-0">
                {menuItems.find((item) => isActivePath(item.path))?.label ||
                  "Dashboard"}
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
