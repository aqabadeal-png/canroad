import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useJob } from '../contexts/JobContext';

const SearchingView: React.FC = () => {
    const { t } = useLanguage();
    const { activeJob, cancelJob } = useJob();

    const handleCancel = () => {
        if (activeJob) {
            cancelJob(activeJob.id, t('cancelReason.customerRequest'));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Radar animation */}
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-6 border-4 border-blue-300 rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute inset-12 border-4 border-blue-400 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                     <svg className="w-16 h-16 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-12">Searching for a Mechanic</h2>
            <p className="text-gray-600 mt-2 max-w-sm">We're finding the nearest available CanRoad professional for you.</p>
            <button 
                onClick={handleCancel} 
                className="mt-8 w-full max-w-sm h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
                {t('tracking.cancelRequest')}
            </button>
        </div>
    );
};

export default SearchingView;