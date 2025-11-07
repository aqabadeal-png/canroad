import { ServiceType, VehicleType } from '../types';

export const PRICING_CONFIG = {
  distance: {
    freeTierKm: 5,
    perKmRate: 1.20,
    cap: 60,
  },

  vehicleSurcharges: {
    'Car': 0,
    'SUV': 15,
    'Truck / Van': 25,
  } as Record<VehicleType, number>,

  afterHours: {
    surchargePercent: 0.15, // 15%
    startHour: 19, // 7 PM
    endHour: 7,    // 7 AM
    // Weekends are Saturday (6) and Sunday (0)
  },

  surge: {
    highDemandThreshold: 0.8,
    highDemandMultiplier: 0.10, // +10%
    veryHighDemandThreshold: 0.5,
    veryHighDemandMultiplier: 0.20, // +20%
    maxSurchargePercent: 0.30, // 30% total cap
  },

  weather: {
    surchargePercent: 0.05, // 5%
  },

  estimate: {
    rangePercent: 0.08, // +/- 8%
  },

  eta: {
    urbanSpeedKphMin: 35,
    urbanSpeedKphMax: 55,
  },

  promoCodes: {
    'SAVE10': 0.10, // 10% discount
  },

  priceLockDurationMinutes: 15,
};

// --- MOCK REAL-TIME DATA ---

// Simulate available mechanics and their locations
export const MOCK_MECHANICS = [
    { id: 'mech-01', lat: 43.4643, lng: -80.5204 }, // Waterloo
    { id: 'mech-02', lat: 43.6532, lng: -79.3832 }, // Toronto
    { id: 'mech-03', lat: 45.4215, lng: -75.6972 }, // Ottawa
    { id: 'mech-04', lat: 43.2557, lng: -79.8711 }, // Hamilton
];

// Simulate current number of open jobs
export const MOCK_OPEN_JOBS = 2; // Change this value to test surge pricing