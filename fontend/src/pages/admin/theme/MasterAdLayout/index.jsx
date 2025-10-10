import { memo, useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../AdminSideBar";

const MasterAdLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop sidebar
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Desktop sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuOpen={false} // desktop không cần menuOpen
        setMenuOpen={() => {}}
      />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "md:ml-64" : "md:ml-16"} w-full`}
      >
        {/* Header mobile */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
          <h1 className="text-lg font-bold text-red-600">Admin Panel</h1>
          <button
            onClick={() => setMenuOpen(true)}
            className="text-red-600 text-xl"
          >
            <FaBars />
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay opacity */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Sidebar slide-in */}
          <div className="absolute left-0 top-0 h-full w-64 bg-red-600 text-white transition-transform transform translate-x-0">
            <AdminSidebar
              sidebarOpen={true} // luôn mở full width mobile
              setSidebarOpen={() => {}}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MasterAdLayout);
