import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getCancelReasons } from '../constants';

interface CancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useLanguage();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [otherReasonText, setOtherReasonText] = useState('');
    
    const cancelReasons = getCancelReasons(t);

    useEffect(() => {
        // Reset state when modal opens
        if (isOpen) {
            setSelectedReason(null);
            setOtherReasonText('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isConfirmDisabled = !selectedReason || (selectedReason === 'other' && !otherReasonText.trim());

    const handleConfirm = () => {
        if (isConfirmDisabled) return;
        const reason = selectedReason === 'other' ? otherReasonText.trim() : cancelReasons.find(r => r.id === selectedReason)?.label || 'Other';
        onConfirm(reason);
    };

    return (
        <div className="absolute inset-0 z-[1003] bg-black bg-opacity-60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
                <h2 id="cancel-modal-title" className="text-xl font-bold text-gray-800">{t('cancelModal.title')}</h2>
                <p className="text-gray-600 mt-2 mb-4">{t('cancelModal.reasonTitle')}</p>

                <div className="space-y-3">
                    {cancelReasons.map(reason => (
                        <div key={reason.id} className="flex items-center">
                            <input
                                id={`reason-${reason.id}`}
                                name="cancel-reason"
                                type="radio"
                                checked={selectedReason === reason.id}
                                onChange={() => setSelectedReason(reason.id)}
                                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <label htmlFor={`reason-${reason.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                                {reason.label}
                            </label>
                        </div>
                    ))}
                    {selectedReason === 'other' && (
                        <textarea
                            value={otherReasonText}
                            onChange={(e) => setOtherReasonText(e.target.value)}
                            placeholder={t('cancelModal.otherPlaceholder')}
                            className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            rows={2}
                        />
                    )}
                </div>

                <div className="mt-6 flex space-x-2">
                    <button onClick={onClose} className="w-1/2 h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">{t('cancelModal.deny')}</button>
                    <button 
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className="w-1/2 h-12 px-6 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                        {t('cancelModal.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelModal;