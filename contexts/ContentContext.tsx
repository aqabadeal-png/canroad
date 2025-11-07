import React, { createContext, useState, ReactNode, useContext, useMemo, useCallback } from 'react';
import { HomePageCard } from '../types';
import { mockHomePageCards } from '../data/mock';

interface ContentContextType {
    homePageCards: HomePageCard[];
    addHomePageCard: (card: Omit<HomePageCard, 'id'>) => void;
    updateHomePageCard: (updatedCard: HomePageCard) => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [homePageCards, setHomePageCards] = useState<HomePageCard[]>(mockHomePageCards);

    const addHomePageCard = useCallback((cardData: Omit<HomePageCard, 'id'>) => {
        const newCard: HomePageCard = {
            id: `card-${Date.now()}`,
            ...cardData,
        };
        setHomePageCards(prev => [...prev, newCard]);
    }, []);

    const updateHomePageCard = useCallback((updatedCard: HomePageCard) => {
        setHomePageCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    }, []);

    const value = useMemo(() => ({ homePageCards, addHomePageCard, updateHomePageCard }), [homePageCards, addHomePageCard, updateHomePageCard]);

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
