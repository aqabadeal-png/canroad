import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { HomePageCard } from '../types';

interface HomePageCardEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (card: HomePageCard | Omit<HomePageCard, 'id'>) => void;
    cardToEdit: HomePageCard | null;
}

const HomePageCardEditorModal: React.FC<HomePageCardEditorModalProps> = ({ isOpen, onClose, onSave, cardToEdit }) => {
    const { t } = useLanguage();
    const [cardData, setCardData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        ctaText: '',
        isEnabled: true,
        isPrimary: false,
        comingSoon: false,
    });

    useEffect(() => {
        if (cardToEdit) {
            setCardData(cardToEdit);
        } else {
            setCardData({ title: '', subtitle: '', imageUrl: '', ctaText: '', isEnabled: true, isPrimary: false, comingSoon: false });
        }
    }, [cardToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (cardToEdit) {
            onSave({ ...cardData, id: cardToEdit.id });
        } else {
            onSave(cardData);
        }
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setCardData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const Toggle: React.FC<{name: string, label: string, checked: boolean}> = ({ name, label, checked }) => (
         <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name={name} id={name} checked={checked} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {cardToEdit ? t('homeCardEditor.editTitle') : t('homeCardEditor.addTitle')}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('homeCardEditor.title.label')}</label>
                        <input type="text" name="title" id="title" value={cardData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div>
                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">{t('homeCardEditor.subtitle.label')}</label>
                        <input type="text" name="subtitle" id="subtitle" value={cardData.subtitle} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">{t('homeCardEditor.imageUrl.label')}</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={cardData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div>
                        <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">{t('homeCardEditor.ctaText.label')}</label>
                        <input type="text" name="ctaText" id="ctaText" value={cardData.ctaText} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    
                    <Toggle name="comingSoon" label={t('homeCardEditor.comingSoon.label')} checked={cardData.comingSoon} />
                    <Toggle name="isEnabled" label={t('homeCardEditor.enabled.label')} checked={cardData.isEnabled} />
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

export default HomePageCardEditorModal;