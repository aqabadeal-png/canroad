import { useContext } from 'react';
import { PricingContext } from '../contexts/PricingContext';

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};
