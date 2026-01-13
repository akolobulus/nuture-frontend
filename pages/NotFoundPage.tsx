
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-brand-green">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-white">Page Not Found</h2>
      <p className="mt-4 max-w-md text-gray-400">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <div className="mt-8">
        <Button as="link" to="/" variant="primary">
            Go Back Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
