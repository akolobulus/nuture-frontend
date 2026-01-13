
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NutureLogo, XIcon } from './IconComponents';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const linkClass = "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-green dark:hover:text-white transition-colors";
  const activeLinkClass = "bg-brand-green !text-white dark:bg-brand-green dark:!text-white";

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl">
              <NutureLogo className="h-8 w-8 text-brand-green" />
              <span>Nuture</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-2">
            <NavLink to="/" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Home</NavLink>
            <NavLink to="/plans" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Plans</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Dashboard</NavLink>
            <NavLink to="/vault" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Health Vault</NavLink>
            <NavLink to="/claims" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Claims</NavLink>
            <NavLink to="/referrals" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Referrals</NavLink>
            <NavLink to="/team" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Team</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={onClose}>Profile</NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
