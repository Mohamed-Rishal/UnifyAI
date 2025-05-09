import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { theme, toggleTheme, costSaved } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const formattedCostSaved = costSaved.toFixed(2);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Chat', href: '/chat' },
    { name: 'Compare', href: '/compare' },
    { name: 'Battle', href: '/battle' },
    { name: 'Voice', href: '/voice' },
  ];

  return (
    <header className={`${theme === 'dark' ? 'bg-dark-400 border-dark-300' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Globe className="h-8 w-8 text-primary-500 mr-2" />
              <span className="text-xl font-bold gradient-text">UnifyAI</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium hover:text-primary-400 transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary-500'
                    : theme === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Cost savings pill */}
            <div className={`hidden lg:flex items-center px-3 py-1 rounded-full text-sm ${
              theme === 'dark' ? 'bg-dark-300 text-green-400' : 'bg-green-100 text-green-800'
            }`}>
              <span className="mr-1">💰</span>
              <span>Saved ${formattedCostSaved}</span>
            </div>
          </nav>

          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-4 md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden ${theme === 'dark' ? 'bg-dark-400' : 'bg-white'} border-b border-gray-700`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? 'bg-primary-600 text-white'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-dark-300 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;