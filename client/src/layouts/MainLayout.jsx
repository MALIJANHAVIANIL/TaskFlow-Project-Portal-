import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] relative">
      {/* Subtle background blobs */}
      <div className="blur-blob blur-blob-blue w-[600px] h-[600px] -top-60 -right-40 opacity-10 fixed" />
      <div className="blur-blob blur-blob-purple w-[400px] h-[400px] bottom-0 -left-40 opacity-10 fixed" />

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
