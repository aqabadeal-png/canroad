import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Job, PricingEstimate, EstimateLineItem } from '../types';
import { CloseIcon } from '../constants';

interface InvoiceEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (finalInvoice: PricingEstimate) => void;
    job: Job | null;
}

const InvoiceEditorModal: React.FC<InvoiceEditorModalProps> = ({ isOpen, onClose, onConfirm, job }) => {
    const { t } = useLanguage();
    const [breakdown, setBreakdown] = useState<EstimateLineItem[]>([]);

    useEffect(() => {
        if (job) {
            // Deep copy to prevent modifying the original job state directly
            setBreakdown(JSON.parse(JSON.stringify(job.initialEstimate.breakdown)));
        }
    }, [job, isOpen]);

    const finalTotal = useMemo(() => {
        return breakdown.reduce((sum, item) => sum + item.amount, 0);
    }, [breakdown]);

    if (!isOpen || !job) return null;

    const handleItemChange = (index: number, field: 'label' | 'amount', value: string | number) => {
        const newBreakdown = [...breakdown];
        const item = { ...newBreakdown[index] };
        if (field === 'label') {
            item.label = value as string;
        } else {
            item.amount = Number(value) || 0;
        }
        newBreakdown[index] = item;
        setBreakdown(newBreakdown);
    };

    const handleAddItem = () => {
        setBreakdown([...breakdown, { label: '', amount: 0, note: 'Added by mechanic' }]);
    };

    const handleRemoveItem = (index: number) => {
        setBreakdown(breakdown.filter((_, i) => i !== index));
    };

    const handleConfirm = () => {
        // Construct the final invoice object
        const finalInvoice: PricingEstimate = {
            ...job.initialEstimate, // Carry over ETA etc., though not used on final bill
            breakdown: breakdown,
            totalMin: finalTotal, // Final price is fixed
            totalMax: finalTotal,
            lockedUntil: null, // Not relevant for final bill
        };
        onConfirm(finalInvoice);
    };
    
    // Function to check if a label is a translation key or a custom string
    const getLabel = (label: string) => {
      // A simple check: if it contains a '.', assume it's a key
      return label.includes('.') ? t(label as any) : label;
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh]">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex-shrink-0">
                    {t('invoiceEditor.title')}
                </h2>
                
                <div className="space-y-4 overflow-y-auto pr-2">
                    {breakdown.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="flex-1">
                                {index < job.initialEstimate.breakdown.length ? (
                                    <input 
                                        type="text" 
                                        value={getLabel(item.label)} 
                                        readOnly 
                                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none" 
                                    />
                                ) : (
                                    <input 
                                        type="text" 
                                        placeholder={t('invoiceEditor.itemDescription.placeholder')}
                                        value={item.label}
                                        onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" 
                                    />
                                )}
                            </div>
                            <div className="w-28">
                                <input 
                                    type="text"
                                    inputMode="decimal"
                                    value={item.amount}
                                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500 text-right"
                                />
                            </div>
                            <div className="w-10 flex justify-center">
                                {index >= job.initialEstimate.breakdown.length ? (
                                     <button onClick={() => handleRemoveItem(index)} className="p-2 text-gray-400 hover:text-red-500" aria-label={t('invoiceEditor.remove')}>
                                        <CloseIcon className="w-6 h-6" />
                                     </button>
                                ) : null}
                            </div>
                        </div>
                    ))}

                    <button onClick={handleAddItem} className="w-full flex items-center justify-center py-2 text-sm font-semibold text-blue-800 bg-blue-50 border-2 border-dashed border-blue-200 rounded-md hover:bg-blue-100">
                        {t('invoiceEditor.addLineItem')}
                    </button>

                    <div className="pt-4 border-t mt-4">
                        <div className="flex justify-between items-baseline text-2xl font-bold text-gray-900">
                            <span>{t('invoiceEditor.finalTotal')}</span>
                            <span>${finalTotal.toFixed(2)} <span className="text-sm font-medium text-gray-500">CAD</span></span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex space-x-2 flex-shrink-0">
                    <button onClick={onClose} className="w-1/3 h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">{t('mapModal.cancel')}</button>
                    <button onClick={handleConfirm} className="w-2/3 h-12 px-6 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        {t('invoiceEditor.confirmPaid')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceEditorModal;