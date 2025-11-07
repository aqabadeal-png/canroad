import React, { useState } from 'react';
import { CloseIcon, ChevronRightIcon } from '../constants';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../hooks/useLanguage';
import { Job, Page } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowLogin: () => void;
  onNavigate: (page: Page) => void;
  jobForEvaluation: Job | null;
  onShowEvaluation: (job: Job) => void;
}

const StarIcon: React.FC<{className: string}> = ({className}) => (
    <svg 
        className={className}
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onShowLogin, onNavigate, jobForEvaluation, onShowEvaluation }) => {
  const { t } = useLanguage();
  const menuItems = [
    { key: 'sidemenu.home', label: t('sidemenu.home'), action: () => onNavigate('Home') },
    { key: 'sidemenu.about', label: t('sidemenu.about'), action: () => {} },
    { key: 'sidemenu.faq', label: t('sidemenu.faq'), action: () => {} },
    { key: 'sidemenu.terms', label: t('sidemenu.terms'), action: () => {} },
    { key: 'sidemenu.privacy', label: t('sidemenu.privacy'), action: () => {} },
  ];
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b">
          {logoError ? (
            <span className="text-xl font-bold" style={{fontFamily: "'Poppins', sans-serif", color: "#283A6B"}}>CanRoad</span>
          ) : (
            <img 
              src="https://i.imghippo.com/files/piSW3404Cuw.png" 
              alt="CanRoad logo" 
              className="w-[48px] h-[40px] object-contain"
              onError={() => setLogoError(true)}
            />
          )}
          <button onClick={onClose} className="p-2 -mr-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label={t('aria.closeMenu')}>
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto">
          {jobForEvaluation && (
            <div className="mb-4">
              <button 
                onClick={() => onShowEvaluation(jobForEvaluation)}
                className="w-full bg-blue-50 border border-blue-200 p-3 rounded-lg text-left hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <div className="flex items-center">
                  <StarIcon className="w-8 h-8 text-yellow-400 mr-3" />
                  <div>
                    <p className="font-bold text-blue-900">{t('sidemenu.rateService.title')}</p>
                    <p className="text-sm text-blue-700">{t('sidemenu.rateService.prompt')}</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button onClick={item.action} className="w-full flex items-center justify-between p-3 text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    <span>{item.label}</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </li>
              ))}
              <li>
                  <button onClick={onShowLogin} className="w-full flex items-center justify-between p-3 text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    <span>{t('sidemenu.mechanicPortal')}</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </li>
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">{t('sidemenu.language')}</span>
              <LanguageToggle />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
