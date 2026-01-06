import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, PackageIcon, FileTextIcon, XIcon, SettingsIcon } from './icons';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 mt-2 text-gray-100 transition-colors duration-300 transform rounded-md hover:bg-secondary ${
      isActive ? 'bg-secondary' : ''
    }`;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <NavLink to="/" className="text-2xl font-semibold text-white">
          H1<span className="text-accent">Brindes</span>
        </NavLink>
        <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-200 lg:hidden hover:text-white focus:outline-none"
        >
            <XIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-10 px-2 flex flex-col justify-between" style={{height: 'calc(100% - 80px)'}}>
        <div>
          <NavLink to="/" end className={navLinkClass}>
            <HomeIcon className="w-5 h-5" />
            <span className="mx-4 font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/clients" className={navLinkClass}>
            <UsersIcon className="w-5 h-5" />
            <span className="mx-4 font-medium">Clientes</span>
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            <PackageIcon className="w-5 h-5" />
            <span className="mx-4 font-medium">Produtos</span>
          </NavLink>
          <NavLink to="/quotes" className={navLinkClass}>
            <FileTextIcon className="w-5 h-5" />
            <span className="mx-4 font-medium">Orçamentos</span>
          </NavLink>
        </div>
        <div>
          <NavLink to="/settings" className={navLinkClass}>
            <SettingsIcon className="w-5 h-5" />
            <span className="mx-4 font-medium">Configurações</span>
          </NavLink>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}>
      </div>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary flex-shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-primary flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;