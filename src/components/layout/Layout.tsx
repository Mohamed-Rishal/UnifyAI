import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useAppContext();
  const location = useLocation();
  
  // For the home page, we don't show the sidebar
  const isHomePage = location.pathname === '/';
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-dark-500 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {!isHomePage && (
          <aside className="w-64 hidden md:block bg-dark-400 border-r border-dark-300">
            <Sidebar />
          </aside>
        )}
        
        <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-dark-500' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;