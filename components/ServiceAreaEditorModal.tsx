import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useLanguage } from '../hooks/useLanguage';
import { ServiceArea } from '../types';

interface ServiceAreaEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (area: ServiceArea | Omit<ServiceArea, 'id'>) => void;
    areaToEdit: ServiceArea | null;
}

// Map Controller Component to programmatically set the map's view
const MapController: React.FC<{ center: LatLng; zoom: number; }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Draggable Marker Component for the Editor
const EditorDraggableMarker: React.FC<{
    position: LatLng;
    setPosition: (latlng: LatLng) => void;
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


const ServiceAreaEditorModal: React.FC<ServiceAreaEditorModalProps> = ({ isOpen, onClose, onSave, areaToEdit }) => {
    const { t } = useLanguage();
    const [areaData, setAreaData] = useState({
        name: '',
        lat: 43.6532, // Default to Toronto
        lng: -79.3832,
        radiusKm: 10,
    });
    
    const [mapCenter, setMapCenter] = useState<LatLng>(new LatLng(areaData.lat, areaData.lng));

    useEffect(() => {
        if (areaToEdit) {
            const initialData = {
                name: areaToEdit.name,
                lat: areaToEdit.center.lat,
                lng: areaToEdit.center.lng,
                radiusKm: areaToEdit.radius / 1000,
            };
            setAreaData(initialData);
            setMapCenter(new LatLng(initialData.lat, initialData.lng));
        } else {
            const defaultData = { name: '', lat: 43.6532, lng: -79.3832, radiusKm: 10 };
            setAreaData(defaultData);
            setMapCenter(new LatLng(defaultData.lat, defaultData.lng));
        }
    }, [areaToEdit, isOpen]);
    
    useEffect(() => {
        const newCenter = new LatLng(areaData.lat, areaData.lng);
        if (!newCenter.equals(mapCenter)) {
            setMapCenter(newCenter);
        }
    }, [areaData.lat, areaData.lng, mapCenter]);

    if (!isOpen) return null;

    const handleSave = () => {
        const dataToSave = {
            name: areaData.name,
            center: {
                lat: areaData.lat,
                lng: areaData.lng,
            },
            radius: areaData.radiusKm * 1000,
        };

        if (areaToEdit) {
            onSave({ ...dataToSave, id: areaToEdit.id });
        } else {
            onSave(dataToSave);
        }
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAreaData(prev => ({
            ...prev,
            [name]: name === 'name' ? value : parseFloat(value) || 0,
        }));
    };
    
    const handleMapPositionChange = (latlng: LatLng) => {
        setAreaData(prev => ({
            ...prev,
            lat: parseFloat(latlng.lat.toFixed(6)),
            lng: parseFloat(latlng.lng.toFixed(6))
        }));
    };

    const currentPosition = new LatLng(areaData.lat, areaData.lng);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex-shrink-0">
                    {areaToEdit ? t('serviceAreaEditor.editTitle') : t('serviceAreaEditor.addTitle')}
                </h2>
                
                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                    <div className="space-y-4 md:w-1/2 flex flex-col">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('serviceAreaEditor.name.label')}</label>
                            <input type="text" name="name" id="name" value={areaData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="lat" className="block text-sm font-medium text-gray-700">{t('serviceAreaEditor.centerLat.label')}</label>
                                <input type="text" inputMode="decimal" name="lat" id="lat" value={areaData.lat} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                            </div>
                            <div>
                                <label htmlFor="lng" className="block text-sm font-medium text-gray-700">{t('serviceAreaEditor.centerLng.label')}</label>
                                <input type="text" inputMode="decimal" name="lng" id="lng" value={areaData.lng} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="radiusKm" className="block text-sm font-medium text-gray-700">{t('serviceAreaEditor.radius.label')}</label>
                            <div className="flex items-center space-x-3 mt-1">
                                <input type="range" min="1" max="100" step="1" name="radiusKm" id="radiusKm" value={areaData.radiusKm} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                <input type="text" inputMode="decimal" value={areaData.radiusKm} onChange={handleChange} name="radiusKm" className="w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500 text-center" />
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 rounded-lg overflow-hidden flex-1 min-h-[250px] md:min-h-0">
                        <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <MapController center={mapCenter} zoom={10} />
                            <EditorDraggableMarker position={currentPosition} setPosition={handleMapPositionChange} />
                            <Circle 
                                center={currentPosition} 
                                radius={areaData.radiusKm * 1000} 
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} 
                            />
                        </MapContainer>
                    </div>
                </div>

                <div className="mt-6 flex space-x-2 flex-shrink-0">
                    <button onClick={onClose} className="w-1/2 h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">{t('serviceEditor.cancel')}</button>
                    <button onClick={handleSave} className="w-1/2 h-12 px-6 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        {t('serviceEditor.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceAreaEditorModal;