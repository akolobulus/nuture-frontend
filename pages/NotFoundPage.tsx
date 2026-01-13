import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

declare const gsap: any;

const NotFoundPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    
    // Simple entrance animation to match the rest of the site
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 }, 
      { duration: 0.8, opacity: 1, y: 0, ease: "power2.out" }
    );
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 overflow-hidden"
    >
      {/* Visual Background Element */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-green rounded-full blur-[120px]"></div>
      </div>

      <h1 className="text-8xl font-black text-brand-green tracking-tighter">404</h1>
      
      <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white transition-colors">
        Lost in the Vault?
      </h2>
      
      <p className="mt-4 max-w-md text-gray-600 dark:text-gray-400 transition-colors">
        The page you're looking for doesn't exist or has been moved to a more secure location. 
        Don't worry, your health data is still safe.
      </p>

      <div className="mt-10 flex gap-4">
        <Button as="link" to="/" variant="primary" className="shadow-lg shadow-brand-green/20">
            Go Back Home
        </Button>
        <Button as="link" to="/dashboard" variant="secondary">
            Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;