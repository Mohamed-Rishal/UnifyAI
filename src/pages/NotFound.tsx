import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center">
      <AlertCircle className="h-16 w-16 text-error-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-400 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button 
          variant="primary" 
          size="lg"
          icon={<Home size={18} />}
        >
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;