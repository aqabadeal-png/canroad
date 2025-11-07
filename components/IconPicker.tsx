
import React from 'react';
import { ICONS } from '../constants';

interface IconPickerProps {
    selectedIcon: string;
    onSelect: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
    return (
        <div className="grid grid-cols-6 gap-2 border p-2 rounded-md">
            {Object.keys(ICONS).map(iconName => {
                const IconComponent = ICONS[iconName as keyof typeof ICONS];
                const isSelected = selectedIcon === iconName;
                return (
                    <button
                        key={iconName}
                        type="button"
                        onClick={() => onSelect(iconName)}
                        className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                            isSelected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-label={`Select ${iconName} icon`}
                    >
                        <IconComponent className="w-6 h-6" />
                    </button>
                );
            })}
        </div>
    );
};

export default IconPicker;
