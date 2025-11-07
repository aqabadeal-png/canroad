import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../hooks/useLanguage';

// Fix for default marker icon, consistent with MapModal
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapWrapper: React.FC = () => {
    const { t } = useLanguage();
    const canadaCenter: L.LatLngTuple = [56.1304, -106.3468];

    return (
        <div className="relative h-full w-full">
            <MapContainer 
                center={canadaCenter} 
                zoom={4} 
                style={{ height: '100%', width: '100%' }}
                dragging={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 bg-black bg-opacity-50 pointer-events-none">
                <h2 className="text-2xl font-bold text-white shadow-sm">{t('map.overlay.title')}</h2>
                <p className="text-gray-200 mt-2 max-w-sm shadow-sm">
                    {t('map.overlay.description')}
                </p>
            </div>
        </div>
    );
};

export default MapWrapper;
