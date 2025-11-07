import React from 'react';
import { PricingEstimate } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { TranslationKey } from '../i18n/translations';

interface EstimateBreakdownProps {
    estimate: PricingEstimate | null;
    showEta?: boolean;
    totalLabelKey?: TranslationKey;
}

const EstimateBreakdown: React.FC<EstimateBreakdownProps> = ({ estimate, showEta = true, totalLabelKey = 'pricing.totalEstimate' }) => {
    const { t } = useLanguage();

    if (!estimate) {
        return <div className="text-center text-gray-500">{t('pricing.selectLocationPrompt')}</div>;
    }

    const formatCurrency = (amount: number) => {
         const sign = amount < 0 ? '-' : '';
         return `${sign}$${Math.abs(amount).toFixed(2)}`;
    };

    return (
        <div className="space-y-2">
            <div className="space-y-1 text-sm text-gray-600">
                {estimate.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span>
                            {t(item.label as any)}
                            {item.note && <span className="text-xs text-gray-400 ml-1">({item.note})</span>}
                        </span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                ))}
            </div>

            <div className="pt-2 border-t mt-2">
                 {showEta && (
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{t('pricing.eta')}</span>
                        <span className="font-medium">{t('pricing.minutesRange', { min: estimate.etaMin, max: estimate.etaMax })}</span>
                    </div>
                 )}
                <div className={`flex justify-between items-baseline text-lg font-bold text-gray-900 ${showEta ? 'mt-1' : ''}`}>
                    <span>{t(totalLabelKey)}</span>
                    <span>${estimate.totalMin}-${estimate.totalMax} <span className="text-sm font-medium text-gray-500">CAD</span></span>
                </div>
            </div>
             <p className="text-xs text-gray-500 pt-2">{t('pricing.guaranteeNote')}</p>
        </div>
    );
};

export default EstimateBreakdown;