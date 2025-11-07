import React, { useState } from 'react';
import { MenuIcon, PhoneIcon } from '../constants';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [logoError, setLogoError] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-32 px-4 bg-white shadow-md shrink-0">
      <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" aria-label={t('aria.openMenu')}>
        <MenuIcon className="w-6 h-6" />
      </button>
      
      {logoError ? (
        <span className="text-2xl font-bold" style={{fontFamily: "'Poppins', sans-serif", color: "#283A6B"}}>CanRoad</span>
      ) : (
        <img 
          src="https://i.imghippo.com/files/qiq8147dUI.png" 
          alt="CanRoad logo" 
          className="w-[320px] h-[100px] object-contain"
          onError={() => setLogoError(true)}
        />
      )}

      <div className="flex items-center space-x-0 sm:space-x-2">
        <LanguageToggle className="hidden sm:flex"/>
        <a href="tel:+12269982646" className="p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" aria-label={t('aria.callCanRoad')}>
          <PhoneIcon className="w-6 h-6" />
        </a>
      </div>
    </header>
  );
};

export default Header;
