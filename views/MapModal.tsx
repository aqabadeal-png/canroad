import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng, LatLngBounds } from 'leaflet';
import { LocationData } from '../types';
import { MapPinIcon } from '../constants';
import { useLanguage } from '../hooks/useLanguage';
import { useServiceArea } from '../contexts/ServiceAreaContext';
import { isPointInServiceArea } from '../utils';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface MapModalProps {
  onClose: () => void;
  onConfirm: (data: LocationData) => void;
}

const DraggableMarker: React.FC<{
    position: LatLng;
    setPosition: React.Dispatch<React.SetStateAction<LatLng>>;
}> = ({ position, setPosition }) => {
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    setPosition(marker.getLatLng());
                }
            },
        }),
        [setPosition],
    );

    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
};

const MapController: React.FC<{position: LatLng}> = ({position}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, 13);
    }, [position, map]);
    return null;
}

const MapModal: React.FC<MapModalProps> = ({ onClose, onConfirm }) => {
    const { t } = useLanguage();
    const { serviceAreas } = useServiceArea();
    const [position, setPosition] = useState<LatLng>(new LatLng(56.1304, -106.3468)); // Default to center of Canada
    const [address, setAddress] = useState<string>(t('mapModal.fetchingAddress'));
    const [isLoading, setIsLoading] = useState(true);
    const [geolocationError, setGeolocationError] = useState<string | null>(null);
    const [isLocationInServiceArea, setIsLocationInServiceArea] = useState(false);
    
    // Define Canada bounds
    const canadaBounds = new LatLngBounds(
        new LatLng(41.676555, -141.00187), // Southwest
        new LatLng(83.11069, -52.619419)     // Northeast
    );

    const fetchAddress = useCallback(async (lat: number, lng: number) => {
        try {
            setAddress(t('mapModal.loadingAddress'));
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (!response.ok) throw new Error('Failed to fetch address');
            const data = await response.json();
            setAddress(data.display_name || t('mapModal.addressNotFound'));
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            setAddress(t('mapModal.addressFetchError'));
        }
    }, [t]);

    const handleGeolocationSuccess = useCallback((pos: GeolocationPosition) => {
        const userPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
        setPosition(userPos);
        setIsLoading(false);
        setGeolocationError(null);
    }, []);

    const handleGeolocationError = useCallback((error: GeolocationPositionError) => {
        let errorMessage = t('mapModal.geolocationError.default');
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = t('mapModal.geolocationError.denied');
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = t('mapModal.geolocationError.unavailable');
                break;
            case error.TIMEOUT:
                errorMessage = t('mapModal.geolocationError.timeout');
                break;
        }
        console.error(`Geolocation error: ${errorMessage} (Code: ${error.code}, Message: ${error.message})`);
        setGeolocationError(errorMessage);
        setIsLoading(false);
    }, [t]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            handleGeolocationSuccess,
            (highAccuracyError) => {
                console.warn('High accuracy geolocation failed, trying low accuracy.', highAccuracyError);
                if (highAccuracyError.code === highAccuracyError.TIMEOUT || highAccuracyError.code === highAccuracyError.POSITION_UNAVAILABLE) {
                    navigator.geolocation.getCurrentPosition(
                        handleGeolocationSuccess,
                        (lowAccuracyError) => {
                            console.error('Low accuracy geolocation also failed.');
                            handleGeolocationError(lowAccuracyError);
                        },
                        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
                    );
                } else {
                    handleGeolocationError(highAccuracyError);
                }
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    }, [handleGeolocationSuccess, handleGeolocationError]);

    useEffect(() => {
        if (position) {
            fetchAddress(position.lat, position.lng);
            const isInArea = isPointInServiceArea({ lat: position.lat, lng: position.lng }, serviceAreas);
            setIsLocationInServiceArea(isInArea);
        }
    }, [position, serviceAreas, fetchAddress]);
    
    const handleConfirm = () => {
        onConfirm({ lat: position.lat, lng: position.lng, address });
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
            <div className="relative flex-1">
                {geolocationError && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-11/12 max-w-md bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg text-center">
                        <p><strong className="font-bold">{t('mapModal.geolocationError.header')}</strong> {geolocationError}</p>
                        <p className="text-sm">{t('mapModal.geolocationError.prompt')}</p>
                    </div>
                )}
                {isLoading && (
                     <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
                         <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-lg font-medium text-gray-600">{t('mapModal.gettingLocation')}</p>
                         </div>
                     </div>
                )}
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} maxBounds={canadaBounds} minZoom={4}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapController position={position} />
                    <DraggableMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
            <div className="p-4 bg-white border-t shadow-lg shrink-0">
                <div className="mb-4">
                    <div className="flex items-start">
                        <MapPinIcon className="w-6 h-6 mr-2 text-red-500 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-gray-800">{t('mapModal.yourLocation')}</h3>
                            <p className="text-sm text-gray-600 h-10">{address}</p>
                            {!isLocationInServiceArea && (
                                <p className="text-sm font-semibold text-red-600 mt-1">{t('mapModal.outsideServiceArea')}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={onClose} className="w-1/3 h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">{t('mapModal.cancel')}</button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={!isLocationInServiceArea}
                        className="w-2/3 h-12 px-6 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLocationInServiceArea ? t('mapModal.confirmLocation') : t('mapModal.button.outsideArea')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapModal;