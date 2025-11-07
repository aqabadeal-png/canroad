

import React, { createContext, useState, ReactNode, useContext, useMemo, useCallback } from 'react';
import { Service } from '../types';

// Initial mock data for services
const mockServices: Service[] = [
    { 
        id: 'generalMechanics', 
        title: 'General Mechanics', 
        description: 'On-the-spot diagnostics and repairs for common engine and electrical issues.', 
        icon: 'EmergencyIcon', 
        basePrice: 80 
    },
    { 
        id: 'tireChange', 
        title: 'Tire Change & Repair', 
        description: 'Flat tire? We can swap it with your spare or perform a plug repair right away.', 
        icon: 'TireIcon', 
        basePrice: 65 
    },
    { 
        id: 'batteryBoost', 
        title: 'Battery Boost', 
        description: 'Dead battery? We provide a quick jump-start to get you back on the road.', 
        icon: 'DiagnosticsIcon', // Re-using an icon for now
        basePrice: 50
    },
    { 
        id: 'oilChange', 
        title: 'Oil & Filter Change', 
        description: 'Mobile oil change service using premium synthetic oils and quality filters.', 
        icon: 'OilIcon', 
        basePrice: 95 
    },
];

interface ServiceContextType {
    services: Service[];
    addService: (serviceData: Omit<Service, 'id'>) => void;
    updateService: (updatedService: Service) => void;
}

export const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [services, setServices] = useState<Service[]>(mockServices);

    const addService = useCallback((serviceData: Omit<Service, 'id'>) => {
        const newService: Service = {
            id: `service-${Date.now()}`,
            ...serviceData,
        };
        setServices(prev => [...prev, newService]);
    }, []);

    const updateService = useCallback((updatedService: Service) => {
        setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    }, []);

    const value = useMemo(() => ({ services, addService, updateService }), [services, addService, updateService]);

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
