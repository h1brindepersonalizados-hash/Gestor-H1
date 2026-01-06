import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, SettingsIcon, LogOutIcon } from './icons';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, onLogout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center">
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold">
                A
                </div>
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Configurações
                    </Link>
                    <button
                        onClick={onLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Sair
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;