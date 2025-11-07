import React, { createContext, useState, ReactNode, useContext, useMemo, useCallback } from 'react';
import { ServiceArea } from '../types';

// Initial mock data for service areas
const mockServiceAreas: ServiceArea[] = [
    { 
        id: 'area-1', 
        name: 'Toronto', 
        center: { lat: 43.6532, lng: -79.3832 }, 
        radius: 30000 // 30km in meters
    },
    { 
        id: 'area-2', 
        name: 'Hamilton', 
        center: { lat: 43.2557, lng: -79.8711 }, 
        radius: 25000 // 25km in meters
    },
];

interface ServiceAreaContextType {
    serviceAreas: ServiceArea[];
    addServiceArea: (areaData: Omit<ServiceArea, 'id'>) => void;
    updateServiceArea: (updatedArea: ServiceArea) => void;
}

export const ServiceAreaContext = createContext<ServiceAreaContextType | undefined>(undefined);

export const ServiceAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(mockServiceAreas);

    const addServiceArea = useCallback((areaData: Omit<ServiceArea, 'id'>) => {
        const newArea: ServiceArea = {
            id: `area-${Date.now()}`,
            ...areaData,
        };
        setServiceAreas(prev => [...prev, newArea]);
    }, []);

    const updateServiceArea = useCallback((updatedArea: ServiceArea) => {
        setServiceAreas(prev => prev.map(a => a.id === updatedArea.id ? updatedArea : a));
    }, []);

    const value = useMemo(() => ({ serviceAreas, addServiceArea, updateServiceArea }), [serviceAreas, addServiceArea, updateServiceArea]);

    return (
        <ServiceAreaContext.Provider value={value}>
            {children}
        </ServiceAreaContext.Provider>
    );
};

export const useServiceArea = () => {
  const context = useContext(ServiceAreaContext);
  if (context === undefined) {
    throw new Error('useServiceArea must be used within a ServiceAreaProvider');
  }
  return context;
};
