import React from 'react';
import { Page, Service, VehicleType } from './types';
import { TranslationKey } from './i18n/translations';

export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const WrenchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const DollarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m0-13a9 9 0 110 18 9 9 0 010-18z" />
  </svg>
);

// --- Vehicle & Service Icons ---
export const CarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.94V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h12v-2.94M4 11V9a2 2 0 0 1 2-2h4"/><path d="M19 12h-5"/><path d="M19 17h-5"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
);
export const SuvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="10" rx="2" /><path d="M12 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/></svg>
);
export const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 17.5V13H3V6a2 2 0 0 1 2-2h5.5l3.5 4H20a2 2 0 0 1 2 2v5.5a3.5 3.5 0 0 1-3.5 3.5H17"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
);
export const EmergencyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
);
export const TireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m2 12h2"/><path d="m20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
);
export const DiagnosticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/><path d="M22 12h-2m-2 5.5-1.5-1.5m-7 0L8 17.5M12 6V4m-5.5 2L5 6.5m12.5 0L19 6.5"/></svg>
);
export const OilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 12.5v8.5"/><path d="m12 21 4-4"/></svg>
);
export const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
);

// Central map of all available icons for dynamic selection
export const ICONS = {
    HomeIcon, WrenchIcon, MapPinIcon, PhoneIcon, MenuIcon, CloseIcon, ChevronRightIcon,
    DollarIcon, CarIcon, SuvIcon, TruckIcon, EmergencyIcon, TireIcon, DiagnosticsIcon,
    OilIcon, FilterIcon,
};

export const vehicleTypeKeyMap: Record<VehicleType, TranslationKey> = {
  'Car': 'vehicleType.car',
  'SUV': 'vehicleType.suv',
  'Truck / Van': 'vehicleType.truck_van',
};

export const serviceTypeKeyMap: { [key: string]: TranslationKey } = {
  'generalMechanics': 'serviceType.generalMechanics',
  'tireChange': 'serviceType.tireChange',
  'diagnostics': 'serviceType.diagnostics',
  'oilChange': 'serviceType.oilChange',
  'filterReplacement': 'serviceType.filterReplacement',
  'batteryBoost': 'serviceType.batteryBoost',
  // Note: custom service types will not have a key here and will fallback to their own string value in the `t` function
};

export const getNavItems = (t: (key: TranslationKey) => string): { page: Page; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] => [
  { page: 'Home', label: t('nav.home'), icon: HomeIcon },
  { page: 'Services', label: t('nav.services'), icon: WrenchIcon },
  { page: 'Pricing', label: t('nav.pricing'), icon: DollarIcon },
  { page: 'Contact', label: t('nav.contact'), icon: PhoneIcon },
];

export const getServiceOptions = (services: Service[], t: (key: TranslationKey, ...args: any[]) => string) => {
    return services.map(service => ({
        value: service.id,
        label: t(`service.${service.id}.title` as TranslationKey, service.title),
    }));
};

export const getCancelReasons = (t: (key: TranslationKey) => string): { id: string, label: string }[] => [
    { id: 'noLongerNeeded', label: t('cancelReason.noLongerNeeded')},
    { id: 'customerRequest', label: t('cancelReason.customerRequest')},
    { id: 'noAnswer', label: t('cancelReason.noAnswer') },
    { id: 'wrongInfo', label: t('cancelReason.wrongInfo') },
    { id: 'safetyConcern', label: t('cancelReason.safetyConcern') },
    { id: 'other', label: t('cancelReason.other') }
];
