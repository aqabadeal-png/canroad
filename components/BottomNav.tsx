import React from 'react';
import { Page } from '../types';
import { getNavItems } from '../constants';
import { useLanguage } from '../hooks/useLanguage';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const { t } = useLanguage();
  const navItems = getNavItems(t);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors duration-200 ${
              activePage === item.page ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
