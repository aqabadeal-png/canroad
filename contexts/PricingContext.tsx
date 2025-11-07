import React, { createContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { PricingInputs, PricingEstimate, LocationData, ServiceType, VehicleType } from '../types';
import { calculateEstimate } from '../pricing';
import { PRICING_CONFIG } from '../data/pricingConfig';
import { useServices } from './ServiceContext';


interface PricingContextType {
  inputs: PricingInputs;
  estimate: PricingEstimate | null;
  updatePricingInput: <K extends keyof PricingInputs>(key: K, value: PricingInputs[K]) => void;
  lockPrice: () => PricingEstimate | null;
}

export const PricingContext = createContext<PricingContextType | undefined>(undefined);

const initialInputs: PricingInputs = {
    location: null,
    serviceType: 'generalMechanics',
    vehicleType: 'Car',
    promoCode: '',
    applyWeatherSurcharge: false,
};

export const PricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [inputs, setInputs] = useState<PricingInputs>(initialInputs);
    const [estimate, setEstimate] = useState<PricingEstimate | null>(null);
    const { services } = useServices();

    const updatePricingInput = useCallback(<K extends keyof PricingInputs>(key: K, value: PricingInputs[K]) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    }, []);

    const lockPrice = useCallback((): PricingEstimate | null => {
        if (!estimate) return null;

        const lockedUntil = Date.now() + PRICING_CONFIG.priceLockDurationMinutes * 60 * 1000;
        const lockedEstimate = { ...estimate, lockedUntil };
        
        setEstimate(lockedEstimate);

        // Set a timer to "unlock" the price after the duration
        setTimeout(() => {
            setEstimate(prev => {
                if (prev && prev.lockedUntil === lockedUntil) {
                    return { ...prev, lockedUntil: null };
                }
                return prev;
            });
        }, PRICING_CONFIG.priceLockDurationMinutes * 60 * 1000);

        return lockedEstimate;

    }, [estimate]);

    useEffect(() => {
        const newEstimate = calculateEstimate(inputs, services);
        // Only update if it's not locked
        setEstimate(prev => {
            if (prev?.lockedUntil) {
                // If locked, we don't recalculate, but we can update the non-price parts if needed
                // For now, we just keep the locked estimate
                return prev;
            }
            return newEstimate;
        });
    }, [inputs, services]);

    const value = useMemo(() => ({ inputs, estimate, updatePricingInput, lockPrice }), [inputs, estimate, updatePricingInput, lockPrice]);

    return (
        <PricingContext.Provider value={value}>
            {children}
        </PricingContext.Provider>
    );
};