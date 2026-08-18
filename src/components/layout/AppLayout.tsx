import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Right side: Header + scrollable main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={openSidebar} />

        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
