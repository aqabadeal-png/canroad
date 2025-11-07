import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageToggle: React.FC<{className?: string}> = ({ className }) => {
    const { language, setLanguage } = useLanguage();

    const isFrench = language === 'fr';

    const handleToggle = () => {
        setLanguage(isFrench ? 'en' : 'fr');
    };

    return (
        <button
            onClick={handleToggle}
            className={`flex items-center justify-center p-2 text-sm font-semibold text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 ${className}`}
            aria-label={`Switch to ${isFrench ? 'English' : 'French'}`}
        >
            <span className={!isFrench ? 'font-bold text-red-500' : 'font-medium'}>EN</span>
            <span className="mx-1 text-gray-300">/</span>
            <span className={isFrench ? 'font-bold text-red-500' : 'font-medium'}>FR</span>
        </button>
    );
};

export default LanguageToggle;
