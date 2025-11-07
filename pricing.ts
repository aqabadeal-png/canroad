import { PricingInputs, LocationData, PricingEstimate, EstimateLineItem, Service } from './types';
import { PRICING_CONFIG, MOCK_MECHANICS, MOCK_OPEN_JOBS } from './data/pricingConfig';
import { haversineDistance } from './utils';

const findNearestMechanic = (customerLocation: LocationData) => {
    let nearestDist = Infinity;
    for (const mechanic of MOCK_MECHANICS) {
        const dist = haversineDistance(customerLocation, mechanic);
        if (dist < nearestDist) {
            nearestDist = dist;
        }
    }
    return nearestDist;
};


export const calculateEstimate = (inputs: PricingInputs, services: Service[]): PricingEstimate | null => {
    if (!inputs.location) {
        return null;
    }

    const breakdown: EstimateLineItem[] = [];
    let subtotal = 0;

    // 1. Base Price
    const basePrice = services.find(s => s.id === inputs.serviceType)?.basePrice || 0;
    subtotal += basePrice;
    breakdown.push({ label: 'pricing.breakdown.base', amount: basePrice });

    // 2. Distance Fee
    const distanceKm = findNearestMechanic(inputs.location);
    const chargeableDistance = Math.max(0, distanceKm - PRICING_CONFIG.distance.freeTierKm);
    const distanceFee = Math.min(
        chargeableDistance * PRICING_CONFIG.distance.perKmRate,
        PRICING_CONFIG.distance.cap
    );
    if (distanceFee > 0) {
        subtotal += distanceFee;
        breakdown.push({ label: 'pricing.breakdown.distance', amount: distanceFee, note: `${distanceKm.toFixed(1)} km` });
    }
    
    // 3. Vehicle Surcharge
    const vehicleSurcharge = PRICING_CONFIG.vehicleSurcharges[inputs.vehicleType];
    if (vehicleSurcharge > 0) {
        subtotal += vehicleSurcharge;
        breakdown.push({ label: 'pricing.breakdown.vehicle', amount: vehicleSurcharge, note: inputs.vehicleType });
    }

    // 4. After-Hours Surcharge
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    const isAfterHours = hour >= PRICING_CONFIG.afterHours.startHour || hour < PRICING_CONFIG.afterHours.endHour || dayOfWeek === 0 || dayOfWeek === 6;
    if (isAfterHours) {
        const afterHoursFee = subtotal * PRICING_CONFIG.afterHours.surchargePercent;
        subtotal += afterHoursFee;
        breakdown.push({ label: 'pricing.breakdown.afterHours', amount: afterHoursFee });
    }

    // 5. Surge Pricing
    const surgeRatio = MOCK_MECHANICS.length / (MOCK_OPEN_JOBS + 1); // +1 to avoid division by zero
    let surgeMultiplier = 0;
    if (surgeRatio < PRICING_CONFIG.surge.veryHighDemandThreshold) {
        surgeMultiplier = PRICING_CONFIG.surge.veryHighDemandMultiplier;
    } else if (surgeRatio < PRICING_CONFIG.surge.highDemandThreshold) {
        surgeMultiplier = PRICING_CONFIG.surge.highDemandMultiplier;
    }
    
    if (surgeMultiplier > 0) {
        const maxSurgeFromBase = basePrice * PRICING_CONFIG.surge.maxSurchargePercent;
        const surgeFee = Math.min(subtotal * surgeMultiplier, maxSurgeFromBase);
        subtotal += surgeFee;
        breakdown.push({ label: 'pricing.breakdown.surge', amount: surgeFee, note: `+${surgeMultiplier * 100}%`});
    }

    // 6. Weather Surcharge
    if (inputs.applyWeatherSurcharge) {
        const weatherFee = subtotal * PRICING_CONFIG.weather.surchargePercent;
        subtotal += weatherFee;
        breakdown.push({ label: 'pricing.breakdown.weather', amount: weatherFee });
    }

    // 7. Promo Code
    const promoDiscount = PRICING_CONFIG.promoCodes[inputs.promoCode.toUpperCase() as keyof typeof PRICING_CONFIG.promoCodes];
    if (promoDiscount) {
        const discountAmount = -Math.abs(subtotal * promoDiscount);
        subtotal += discountAmount;
        breakdown.push({ label: 'pricing.breakdown.promo', amount: discountAmount, note: inputs.promoCode.toUpperCase() });
    }

    // Calculate Total Range
    const total = Math.round(subtotal);
    const range = Math.round(total * PRICING_CONFIG.estimate.rangePercent);
    const totalMin = Math.max(0, total - range);
    const totalMax = total + range;

    // Calculate ETA
    const etaHoursMin = distanceKm / PRICING_CONFIG.eta.urbanSpeedKphMax;
    const etaHoursMax = distanceKm / PRICING_CONFIG.eta.urbanSpeedKphMin;
    const etaMin = Math.round(etaHoursMin * 60);
    const etaMax = Math.round(etaHoursMax * 60);

    return {
        totalMin,
        totalMax,
        etaMin,
        etaMax,
        breakdown,
        lockedUntil: null
    };
};
