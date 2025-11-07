import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { usePricing } from '../hooks/usePricing';
import { ServiceType, VehicleType } from '../types';
import { getServiceOptions } from '../constants';
import EstimateBreakdown from '../components/EstimateBreakdown';
import { useServices } from '../contexts/ServiceContext';
import { useServiceArea } from '../contexts/ServiceAreaContext';
import { isPointInServiceArea, haversineDistance } from '../utils';
import { MOCK_MECHANICS } from '../data/pricingConfig';

import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';

interface PricingProps {
    onBookNow: () => void;
}

const mechanicIcon = L.divIcon({
    html: '🚗',
    className: 'text-2xl opacity-60',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

const nearestMechanicIcon = L.divIcon({
    html: '🚗',
    className: 'text-4xl drop-shadow-lg',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
});

const DraggablePricingMarker: React.FC<{onAreaWarning: (show: boolean) => void}> = ({ onAreaWarning }) => {
    const { inputs, updatePricingInput } = usePricing();
    const { serviceAreas } = useServiceArea();

    const nearestMechanic = useMemo(() => {
        if (!inputs.location) return null;
        
        let nearestDist = Infinity;
        let nearestMech = null;

        for (const mechanic of MOCK_MECHANICS) {
            const dist = haversineDistance(inputs.location, mechanic);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestMech = mechanic;
            }
        }
        return nearestMech;
    }, [inputs.location]);


    const map = useMapEvents({
        click(e) {
            const point = { lat: e.latlng.lat, lng: e.latlng.lng };
            if (isPointInServiceArea(point, serviceAreas)) {
                updatePricingInput('location', { ...point, address: 'Selected on map' });
                onAreaWarning(false);
            } else {
                updatePricingInput('location', null);
                onAreaWarning(true);
            }
        },
    });

    // Center map on initial load or when location/mechanic changes
    useEffect(() => {
        if (!inputs.location) {
             map.setView([43.65, -79.7], 8); // Center between Toronto/Hamilton
        } else if (nearestMechanic) {
             const userLatLng = L.latLng(inputs.location.lat, inputs.location.lng);
             const mechLatLng = L.latLng(nearestMechanic.lat, nearestMechanic.lng);
             map.flyToBounds(L.latLngBounds([userLatLng, mechLatLng]), { padding: [50, 50], maxZoom: 14 });
        } else {
             map.setView([inputs.location.lat, inputs.location.lng], 13);
        }
    }, [inputs.location, nearestMechanic, map]);

    return (
        <>
            {inputs.location && (
                <Marker 
                    position={[inputs.location.lat, inputs.location.lng]}
                    zIndexOffset={1000} 
                />
            )}
            {MOCK_MECHANICS.map(mech => (
                 <Marker 
                    key={mech.id} 
                    position={[mech.lat, mech.lng]} 
                    icon={mech.id === nearestMechanic?.id ? nearestMechanicIcon : mechanicIcon}
                 />
            ))}
            {inputs.location && nearestMechanic && (
                <Polyline 
                    positions={[
                        [inputs.location.lat, inputs.location.lng],
                        [nearestMechanic.lat, nearestMechanic.lng]
                    ]} 
                    pathOptions={{ color: '#2563EB', weight: 3, opacity: 0.7, dashArray: '5, 10' }} 
                />
            )}
        </>
    );
};


const Pricing: React.FC<PricingProps> = ({ onBookNow }) => {
    const { t } = useLanguage();
    const { inputs, estimate, updatePricingInput } = usePricing();
    const { services } = useServices();
    const [showAreaWarning, setShowAreaWarning] = useState(false);

    const serviceOptions = getServiceOptions(services, t);
    const vehicleOptions: { value: VehicleType; label: string }[] = [
        { value: 'Car', label: t('vehicleType.car') },
        { value: 'SUV', label: t('vehicleType.suv') },
        { value: 'Truck / Van', label: t('vehicleType.truck_van') },
    ];
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6">
                 <h1 className="text-2xl font-bold text-gray-800">{t('pricing.title')}</h1>
                 <p className="text-gray-600">{t('pricing.subtitle')}</p>
            </div>
            <div className="flex-grow h-48 sm:h-64 relative">
                 <MapContainer center={[56.1304, -106.3468]} zoom={4} style={{ height: '100%', width: '100%' }} zoomControl={true} scrollWheelZoom={true}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <DraggablePricingMarker onAreaWarning={setShowAreaWarning} />
                </MapContainer>
                {showAreaWarning && (
                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                        {t('pricing.outsideServiceArea')}
                    </div>
                )}
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-t-xl shadow-lg-top space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="pricing-serviceType" className="block text-sm font-medium text-gray-700">{t('bookingForm.serviceType.label')}</label>
                        <select id="pricing-serviceType" value={inputs.serviceType} onChange={(e) => updatePricingInput('serviceType', e.target.value as ServiceType)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md h-11">
                            {serviceOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="pricing-vehicleType" className="block text-sm font-medium text-gray-700">{t('bookingForm.vehicle.label')}</label>
                        <select id="pricing-vehicleType" value={inputs.vehicleType} onChange={(e) => updatePricingInput('vehicleType', e.target.value as VehicleType)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md h-11">
                            {vehicleOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    </div>
                </div>

                <EstimateBreakdown estimate={estimate} />
                
                <button 
                    onClick={onBookNow} 
                    disabled={!estimate}
                    className="w-full h-12 px-6 font-bold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {t('pricing.cta')}
                </button>
            </div>
        </div>
    );
};

export default Pricing;