import React from 'react';
import { Job } from '../types';
import { TranslationKey } from '../i18n/translations';
import { getServiceOptions, vehicleTypeKeyMap } from '../constants';
import { useServices } from '../contexts/ServiceContext';

interface JobCardProps {
    job: Job;
    t: (key: TranslationKey, ...args: any[]) => string;
    onAccept?: () => void;
    onReject?: () => void;
    onStartWork?: () => void;
    onComplete?: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start text-sm">
        <div className="w-5 h-5 mr-3 text-gray-400">{icon}</div>
        <div className="flex-1">
            <span className="font-semibold text-gray-800">{label}:</span>
            <span className="ml-2 text-gray-600">{value}</span>
        </div>
    </div>
);

const JobCard: React.FC<JobCardProps> = ({ job, t, onAccept, onReject, onStartWork, onComplete }) => {
    const { services } = useServices();

    const getStatusInfo = (): { text: string; color: string } => {
        switch (job.status) {
            case 'pending': return { text: t('dashboard.job.status.pending'), color: 'bg-yellow-100 text-yellow-800' };
            case 'assigned': return { text: t('dashboard.job.status.assigned'), color: 'bg-blue-100 text-blue-800' };
            case 'arrived': return { text: t('dashboard.job.status.arrived'), color: 'bg-purple-100 text-purple-800' };
            case 'in_progress': return { text: t('dashboard.job.status.in_progress'), color: 'bg-indigo-100 text-indigo-800' };
            case 'completed': return { text: t('dashboard.job.status.completed'), color: 'bg-green-100 text-green-800' };
            case 'cancelled': return { text: t('dashboard.job.status.cancelled'), color: 'bg-red-100 text-red-800' };
            default: return { text: job.status, color: 'bg-gray-100 text-gray-800' };
        }
    };
    
    const serviceOptions = getServiceOptions(services, t);
    const serviceLabel = serviceOptions.find(opt => opt.value === job.serviceType)?.label || job.serviceType;
    const vehicleTypeKey = vehicleTypeKeyMap[job.vehicleType];
    const statusInfo = getStatusInfo();

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">{serviceLabel}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                    {statusInfo.text}
                </span>
            </div>
            <div className="p-4 space-y-3">
                <InfoRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                    label={t('dashboard.job.customer')}
                    value={
                        <span>
                            {job.customerName}{' / '}
                            <a href={`tel:${job.customerPhone}`} className="text-blue-600 hover:underline">
                                {job.customerPhone}
                            </a>
                        </span>
                    }
                />
                <InfoRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3h9M3.375 21h17.25c1.035 0 1.875-.84 1.875-1.875V4.875c0-1.035-.84-1.875-1.875-1.875H3.375c-1.035 0-1.875.84-1.875 1.875v14.25c0 1.035.84 1.875 1.875 1.875z" /></svg>}
                    label={t('dashboard.job.vehicleType')}
                    value={t(vehicleTypeKey)}
                />
                 {(job.vehicleMake || job.vehicleModel) && (
                     <InfoRow 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 0 .094-1.612l3.471-6.942a2.25 2.25 0 0 1 2.006-1.332h3.858c.877 0 1.7.42 2.236 1.144l3.25 4.875a2.25 2.25 0 0 1 .44 2.023l-1.01 4.043M3.375 14.25h17.25" /></svg>}
                        label={t('dashboard.job.vehicleMakeModel')}
                        value={`${job.vehicleMake || 'N/A'} - ${job.vehicleModel || 'N/A'}`}
                    />
                 )}
                 <InfoRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" /></svg>}
                    label={t('dashboard.job.location')}
                    value={
                        <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${job.customerLocation.lat},${job.customerLocation.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {job.customerLocation.address}
                        </a>
                    }
                />
                 {job.initialEstimate && (
                    <InfoRow 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>}
                        label={t('dashboard.job.estimate')}
                        value={`$${job.initialEstimate.totalMin}-${job.initialEstimate.totalMax}`}
                    />
                 )}
                 {job.cancellationReason && (
                    <InfoRow 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>}
                        label={t('dashboard.job.cancellationReason')}
                        value={<span className="italic">{job.cancellationReason}</span>}
                    />
                 )}
            </div>

            {/* --- ACTION BUTTONS --- */}
            {job.status === 'pending' && onAccept && onReject && (
                <div className="p-4 bg-gray-50 flex space-x-2">
                    <button onClick={onReject} className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        {t('dashboard.job.reject')}
                    </button>
                    <button onClick={onAccept} className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        {t('dashboard.job.accept')}
                    </button>
                </div>
            )}
            {job.status === 'assigned' && onStartWork && (
                 <div className="p-4 bg-gray-50">
                    <button onClick={onStartWork} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                        {t('dashboard.job.startWork')}
                    </button>
                </div>
            )}
            {(job.status === 'arrived' || job.status === 'in_progress') && onComplete && (
                 <div className="p-4 bg-gray-50">
                    <button onClick={onComplete} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        {t('dashboard.job.complete')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobCard;
