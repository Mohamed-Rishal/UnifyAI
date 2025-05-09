import React from 'react';
import { Github, Twitter, Coffee } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const Footer: React.FC = () => {
  const { theme } = useAppContext();
  
  return (
    <footer className={`py-4 ${theme === 'dark' ? 'bg-dark-400 border-dark-300' : 'bg-white border-gray-200'} border-t`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center text-sm">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              © 2025 UnifyAI. All rights reserved.
            </span>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
              aria-label="Github"
            >
              <Github size={18} />
            </a>
            <a 
              href="#" 
              className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a 
              href="#" 
              className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
              aria-label="Buy us a coffee"
            >
              <Coffee size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;