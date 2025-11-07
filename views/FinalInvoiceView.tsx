import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Job } from '../types';
import EstimateBreakdown from '../components/EstimateBreakdown';

interface FinalInvoiceViewProps {
    job: Job;
    onAcknowledge: () => void;
}

const FinalInvoiceView: React.FC<FinalInvoiceViewProps> = ({ job, onAcknowledge }) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <svg className="w-20 h-20 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <h1 className="text-2xl font-bold text-gray-800">{t('finalInvoice.title')}</h1>
                <p className="text-gray-600 mt-2 mb-6">{t('finalInvoice.subtitle')}</p>
                
                <div className="my-6 border-t border-b py-4 text-left">
                    <EstimateBreakdown 
                        estimate={job.finalInvoice || job.initialEstimate} 
                        showEta={false}
                        totalLabelKey='evaluation.finalTotal'
                    />
                </div>

                <button 
                    onClick={onAcknowledge} 
                    className="w-full h-12 px-6 font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {t('finalInvoice.acknowledge')}
                </button>
            </div>
        </div>
    );
};

export default FinalInvoiceView;
