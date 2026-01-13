
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  to?: string;
} & (
  | ({ as?: 'button' } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: 'link' } & LinkProps)
);


const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', as = 'button', ...props }) => {
  const baseClasses = 'px-8 py-3 font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900';
  
  const variantClasses = {
    primary: 'bg-brand-green text-white hover:bg-green-600 hover:shadow-glow-green focus:ring-brand-green',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400 dark:focus:ring-gray-500',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (as === 'link') {
    return (
      <Link className={combinedClasses} {...(props as LinkProps)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};

export default Button;
