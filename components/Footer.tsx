import React from 'react';
import { Link } from 'react-router-dom';
import { NutureLogo } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl mb-4 transition-colors">
              <NutureLogo className="h-8 w-8 text-brand-green" />
              <span>Nuture</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
              Student-friendly health insurance for a healthier campus life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase transition-colors">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/plans" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Plans</Link></li>
              <li><Link to="/dashboard" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Dashboard</Link></li>
              <li><Link to="/claims" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Claims</Link></li>
              <li><Link to="/referrals" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Referrals</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase transition-colors">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/team" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Our Team</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase transition-colors">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Privacy</Link></li>
              <li><Link to="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Terms</Link></li>
              <li><Link to="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-500 transition-colors">
          <p>&copy; {new Date().getFullYear()} <a href="https://www.linkedin.com/in/akolo-bulus" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline transition-colors">Akolo Bulus</a>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;