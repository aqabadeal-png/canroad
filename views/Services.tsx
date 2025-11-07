import React, { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import { useLanguage } from '../hooks/useLanguage';
import { useServices } from '../contexts/ServiceContext';

// Skeleton component for a single service card
const ServiceCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4 animate-pulse">
        <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
        </div>
        <div className="w-full">
            <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mt-1"></div>
        </div>
    </div>
);


const Services: React.FC = () => {
  const { t } = useLanguage();
  const { services } = useServices();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsLoading(false);
      }, 1200); // Simulate network delay
      return () => clearTimeout(timer);
  }, []);
  

  if (isLoading) {
    return (
        <div className="p-4 sm:p-6">
            <div className="h-7 bg-gray-200 rounded-md w-1/2 mb-4 animate-pulse"></div>
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => <ServiceCardSkeleton key={i} />)}
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('services.title')}</h1>
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;