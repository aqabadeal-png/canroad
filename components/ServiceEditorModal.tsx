import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Service } from '../types';
import IconPicker from './IconPicker';

interface ServiceEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: Service | Omit<Service, 'id'>) => void;
    serviceToEdit: Service | null;
}

const ServiceEditorModal: React.FC<ServiceEditorModalProps> = ({ isOpen, onClose, onSave, serviceToEdit }) => {
    const { t } = useLanguage();
    const [serviceData, setServiceData] = useState({
        title: '',
        description: '',
        basePrice: 0,
        icon: 'WrenchIcon',
    });

    useEffect(() => {
        if (serviceToEdit) {
            setServiceData(serviceToEdit);
        } else {
            setServiceData({ title: '', description: '', basePrice: 0, icon: 'WrenchIcon' });
        }
    }, [serviceToEdit, isOpen]);

    if (!isOpen) return null;
    
    const handleSave = () => {
        if (serviceToEdit) {
            onSave({ ...serviceData, id: serviceToEdit.id });
        } else {
            onSave(serviceData);
        }
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setServiceData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {serviceToEdit ? t('serviceEditor.editTitle') : t('serviceEditor.addTitle')}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('serviceEditor.title.label')}</label>
                        <input type="text" name="title" id="title" value={serviceData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('serviceEditor.description.label')}</label>
                        <textarea name="description" id="description" value={serviceData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">{t('serviceEditor.price.label')}</label>
                        <input type="number" inputMode="decimal" name="basePrice" id="basePrice" value={serviceData.basePrice} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('serviceEditor.icon.label')}</label>
                        <IconPicker selectedIcon={serviceData.icon} onSelect={(icon) => setServiceData(p => ({...p, icon}))} />
                    </div>
                </div>

                <div className="mt-6 flex space-x-2">
                    <button onClick={onClose} className="w-1/2 h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">{t('serviceEditor.cancel')}</button>
                    <button onClick={handleSave} className="w-1/2 h-12 px-6 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        {t('serviceEditor.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceEditorModal;