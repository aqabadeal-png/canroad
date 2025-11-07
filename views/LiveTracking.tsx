import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { LocationData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useJob } from '../contexts/JobContext';
import CancelModal from '../components/CancelModal';

interface LiveTrackingProps {
  customerLocation: LocationData;
  onComplete: () => void;
  onReturnHome: () => void;
}

const useDivIcon = (content: string, className: string) => {
    return useMemo(() => L.divIcon({
        html: content,
        className: `leaflet-div-icon ${className}`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    }), [content, className]);
};

const MapBoundsFitter: React.FC<{ mechanicLocation: LatLng | null; customerLocation: LatLng }> = ({ mechanicLocation, customerLocation }) => {
    const map = useMap();
    useEffect(() => {
        if (mechanicLocation) {
            const bounds = L.latLngBounds([mechanicLocation, customerLocation]);
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 15 });
        }
    }, [mechanicLocation, customerLocation, map]);
    return null;
};

const LiveTracking: React.FC<LiveTrackingProps> = ({ customerLocation, onComplete, onReturnHome }) => {
    const { t } = useLanguage();
    const { mechanicLocation, assignedMechanic, activeJob, cancelJob } = useJob();
    
    const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);

    const customerLatLng = useMemo(() => new LatLng(customerLocation.lat, customerLocation.lng), [customerLocation]);
    const currentMechanicLatLng = useMemo(() => mechanicLocation ? new LatLng(mechanicLocation.lat, mechanicLocation.lng) : null, [mechanicLocation]);

    const mechanicIcon = useDivIcon('🚗', 'text-4xl');
    const customerIcon = useDivIcon('📍', 'text-4xl');
    
    // Side effect for when job is completed - transition immediately to evaluation screen
    useEffect(() => {
        if (activeJob?.status === 'completed') {
            onComplete();
        }
    }, [activeJob, onComplete]);

    // Effect for calculating ETA
    useEffect(() => {
        if (currentMechanicLatLng && (activeJob?.status === 'assigned')) {
            const distanceMeters = currentMechanicLatLng.distanceTo(customerLatLng);
            const averageSpeedMs = 13.8; // ~50 km/h
            const etaSeconds = distanceMeters / averageSpeedMs;
            const newEtaMinutes = Math.ceil(etaSeconds / 60);
            setEtaMinutes(newEtaMinutes);
        } else if (['arrived', 'in_progress', 'completed'].includes(activeJob?.status || '')) {
            setEtaMinutes(0);
        }
    }, [currentMechanicLatLng, customerLatLng, activeJob?.status]);


    const handleConfirmCancel = (reason: string) => {
        if (activeJob) {
            cancelJob(activeJob.id, reason);
        }
        setCancelModalOpen(false);
    };
    
    const shouldShowArrivalModal = activeJob?.status === 'arrived' || activeJob?.status === 'in_progress';

    return (
        <div className="relative h-full w-full">
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-11/12 max-w-md bg-white p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-gray-800">{t('tracking.title')}</p>
                        <p className="text-sm text-gray-600">Mechanic: {assignedMechanic?.name || 'Assigning...'}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg text-red-500">{etaMinutes !== null && etaMinutes >= 0 ? `${etaMinutes} ${t('tracking.minutes')}` : '--'}</p>
                        <p className="text-xs text-gray-500">{t('tracking.eta')}</p>
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    {assignedMechanic?.phone ? (
                        <a href={`tel:${assignedMechanic.phone}`} className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {t('tracking.callMechanic')}
                        </a>
                    ) : (
                        <button disabled className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 cursor-not-allowed">
                            {t('tracking.callMechanic')}
                        </button>
                    )}
                    <button onClick={() => setCancelModalOpen(true)} className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                        {t('tracking.cancelRequest')}
                    </button>
                </div>
            </div>

            <MapContainer center={customerLatLng} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={customerLatLng} icon={customerIcon} />
                {currentMechanicLatLng && <Marker position={currentMechanicLatLng} icon={mechanicIcon} />}
                <MapBoundsFitter mechanicLocation={currentMechanicLatLng} customerLocation={customerLatLng} />
            </MapContainer>

            {shouldShowArrivalModal && (
                <div className="absolute inset-0 z-[1002] bg-black bg-opacity-60 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
                        <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="text-2xl font-bold text-gray-800">{t('tracking.mechanicArrived.title')}</h2>
                        <p className="text-gray-600 mt-2 mb-6">{t('tracking.mechanicArrived.message')}</p>
                        <button onClick={onReturnHome} className="w-full h-12 px-6 font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {t('tracking.returnToHome')}
                        </button>
                    </div>
                </div>
            )}

            <CancelModal
                isOpen={isCancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
};

export default LiveTracking;
