import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      className="fixed z-40 flex items-center justify-center w-16 h-16 text-white bg-red-500 rounded-full shadow-lg bottom-24 right-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-transform duration-200 hover:scale-105 active:scale-95"
      aria-label={t('aria.requestHelp')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
};

export default FloatingActionButton;
