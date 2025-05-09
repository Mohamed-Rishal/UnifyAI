import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, BarChart2, Trophy, Settings, 
  Download, Mic, HardDrive, Plus, Trash 
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const Sidebar: React.FC = () => {
  const { theme, conversations, createConversation } = useAppContext();
  const location = useLocation();

  // Main navigation items
  const navigation = [
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Compare', href: '/compare', icon: BarChart2 },
    { name: 'Battle', href: '/battle', icon: Trophy },
    { name: 'Voice', href: '/voice', icon: Mic },
    { name: 'Export', href: '/export', icon: Download },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* New conversation button */}
      <div className="p-4">
        <button
          onClick={createConversation}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-md flex items-center justify-center hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          New Conversation
        </button>
      </div>

      {/* Main navigation */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <div className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-primary-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-dark-300 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    location.pathname === item.href
                      ? 'text-white'
                      : theme === 'dark'
                      ? 'text-gray-400 group-hover:text-gray-300'
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Recent conversations */}
      <div className="mt-5 px-3">
        <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Recent Conversations
        </h3>
        <div className="mt-2 max-h-36 overflow-y-auto">
          {conversations.length > 0 ? (
            <ul className="space-y-1">
              {conversations.slice(0, 5).map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    to={`/chat?id=${conversation.id}`}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md truncate ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-dark-300 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <HardDrive className="mr-2 h-4 w-4 text-gray-400" />
                    {conversation.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 px-2 py-2">No conversations yet</p>
          )}
        </div>
      </div>

      {/* Footer section */}
      <div className="mt-auto p-4 text-center">
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          UnifyAI © 2025
        </div>
      </div>
    </div>
  );
};

export default Sidebar;