import React, { useState, useEffect } from 'react';
import { PhoneIcon } from '../constants';
import { useLanguage } from '../hooks/useLanguage';

// Skeleton component for the Contact page
const ContactSkeleton: React.FC = () => (
    <div className="p-4 sm:p-6 animate-pulse">
        <div className="h-7 bg-gray-200 rounded-md w-1/2 mx-auto mb-6"></div>
        <div className="space-y-4">
            <div className="block w-full h-36 bg-gray-300 rounded-xl shadow-md"></div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full mb-4"></div>
                <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
            </div>
        </div>
    </div>
);


const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsLoading(false);
      }, 1200); // Simulate network delay
      return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
      return <ContactSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('contact.title')}</h1>
      
      <div className="space-y-4">
        <a href="tel:+12269982646" className="block w-full text-center p-6 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition-colors">
          <div className="flex flex-col items-center">
            <PhoneIcon className="w-10 h-10 mb-2" />
            <span className="text-xl font-bold">{t('contact.call.title')}</span>
            <span className="text-lg opacity-90">{t('contact.call.number')}</span>
          </div>
        </a>

        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.chat.title')}</h3>
            <p className="text-gray-600 mb-4">{t('contact.chat.description')}</p>
            <button className="w-full h-12 px-6 font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800">
                {t('contact.chat.cta')}
            </button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.email.title')}</h3>
            <p className="text-gray-600">{t('contact.email.description')}</p>
            <a href="mailto:support@canroad.example.com" className="text-red-500 font-medium hover:underline">
                support@canroad.example.com
            </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
