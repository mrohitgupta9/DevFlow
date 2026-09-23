import { useState } from "react";
import { Outlet } from "react-router-dom";

import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="devflow-app">

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="devflow-sidebar">
        <Sidebar />
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* =====================================================
          APPLICATION CONTENT
      ===================================================== */}

      <div className="devflow-main">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="devflow-topbar">
          <Topbar
            onMenuClick={openMobileSidebar}
          />
        </header>

        {/* ===================================================
            ONLY SCROLL CONTAINER
        =================================================== */}

        <main className="devflow-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AppLayout;