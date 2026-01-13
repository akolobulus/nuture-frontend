
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NutureLogo, MenuIcon, SunIcon, MoonIcon } from './IconComponents';
import MobileNav from './MobileNav';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  // Default to false (light mode)
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // Handle Theme Toggle
  useEffect(() => {
    // Check local storage for an explicit user preference
    const storedTheme = localStorage.getItem('theme');
    
    // Explicitly default to light unless 'dark' is specified in storage
    if (storedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      // If no theme is set, we can keep it clean or explicitly set 'light'
      if (!storedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Handle Auth Check
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('nuture_user_session'));
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    // Custom event to trigger re-check after login/logout
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('nuture_user_session');
    // Dispatch event to notify other components/tabs
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  const linkClass = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-green dark:hover:text-white transition-colors";
  const activeLinkClass = "bg-brand-green !text-white dark:bg-brand-green dark:!text-white";

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl transition-colors">
                <NutureLogo className="h-8 w-8 text-brand-green" />
                Nuture
              </NavLink>
              <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <NavLink to="/" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Home</NavLink>
                    <NavLink to="/plans" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Plans</NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Dashboard</NavLink>
                    <NavLink to="/vault" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Health Vault</NavLink>
                    <NavLink to="/claims" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Claims</NavLink>
                    <NavLink to="/referrals" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Referrals</NavLink>
                    <NavLink to="/team" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Team</NavLink>
                  </div>
                </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 gap-4">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle Theme"
                >
                  {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>

                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                      <NavLink to="/profile" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Profile</NavLink>
                      <button onClick={handleSignOut} className={`${linkClass} !bg-red-50 dark:!bg-red-900/20 text-red-600 dark:text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/40`}>Sign Out</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                      <NavLink to="/sign-in" className="px-4 py-2 rounded-md text-sm font-medium bg-brand-green text-white hover:bg-green-600 transition-colors">Login</NavLink>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <button onClick={toggleMobileNav} className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="sr-only">Open main menu</span>
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>
          </div>
        </nav>
      </header>
      <MobileNav isOpen={isMobileNavOpen} onClose={toggleMobileNav} />
    </>
  );
};

export default Header;
