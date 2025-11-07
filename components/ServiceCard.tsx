
import React from 'react';
import { Service } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { ICONS } from '../constants';
import { TranslationKey } from '../i18n/translations';

interface ServiceCardProps {
    service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    const { t } = useLanguage();
    
    // Fallback in case icon key is invalid
    const IconComponent = ICONS[service.icon as keyof typeof ICONS] || ICONS.WrenchIcon;

    // Construct translation keys, with fallback to raw text
    const titleKey = `service.${service.id}.title` as TranslationKey;
    const descriptionKey = `service.${service.id}.description` as TranslationKey;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
            <div className="flex-shrink-0">
                <IconComponent className="h-8 w-8 text-red-500" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">{t(titleKey, service.title)}</h3>
                <p className="mt-1 text-gray-600">{t(descriptionKey, service.description)}</p>
            </div>
        </div>
    );
};

export default ServiceCard;
