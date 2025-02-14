import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoHome, IoSettings, IoMenu, IoLogOut } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 text-gray-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform translate-x-0 md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <nav>
          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
          >
            <IoHome className="inline-block mr-2" size={20} />
            Dashboard
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
          >
            <FaCalendarAlt className="inline-block mr-2" size={20} />
            Calendar
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
          >
            <IoSettings className="inline-block mr-2" size={20} />
            Settings
          </button>
        </nav>
        <button
          onClick={() => navigate("/")}
          className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
        >
          <IoLogOut className="inline-block mr-2" size={20} />
          Logout
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
