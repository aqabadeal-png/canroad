import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Job, User, VehicleType, PricingEstimate } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../contexts/AuthContext';
import { useJob } from '../contexts/JobContext';
import CancelModal from '../components/CancelModal';
import { TranslationKey } from '../i18n/translations';
import JobCard from '../components/JobCard';
import InvoiceEditorModal from '../components/InvoiceEditorModal';

type MechanicStatus = 'Available' | 'On Job' | 'On Break' | 'Offline';
type DashboardTab = 'new' | 'active' | 'history';

const MechanicDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const { jobs, mechanicArrived, completeJob, updateMechanicLocation, acceptJob, rejectJob } = useJob();
  
  const [status, setStatus] = useState<MechanicStatus>('Offline');
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [jobToReject, setJobToReject] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('new');
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [jobToFinalize, setJobToFinalize] = useState<Job | null>(null);
  
  const watchIdRef = useRef<number | null>(null);

  // This effect runs when the component mounts and cleans up when it unmounts.
  useEffect(() => {
    return () => {
      // Ensure location sharing is stopped when the component unmounts.
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount.

  // Filter jobs for the current mechanic
  const { newRequests, assignedJob, jobHistory } = useMemo(() => {
    const myJobs = jobs.filter(job => job.mechanicId === currentUser?.id || job.status === 'pending');
    return {
      newRequests: jobs.filter(job => job.status === 'pending'),
      assignedJob: myJobs.find(job => job.mechanicId === currentUser?.id && ['assigned', 'arrived', 'in_progress'].includes(job.status)) || null,
      jobHistory: myJobs.filter(job => ['completed', 'cancelled'].includes(job.status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    };
  }, [jobs, currentUser]);

  useEffect(() => {
    if (assignedJob) {
      setStatus('On Job');
      if (status !== 'On Job' && !isSharingLocation) {
        handleLocationSharing(true); // Automatically start sharing location
      }
    } else if (status === 'On Job' && !assignedJob) {
      setStatus('Available');
      if(isSharingLocation) handleLocationSharing(false); // Stop sharing
    }
  }, [assignedJob, status]);

  const stopLocationSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsSharingLocation(false);
    setLocationError(null);
  };

  const handleLocationSharing = (start: boolean) => {
    if (!start) {
      stopLocationSharing();
    } else {
      setLocationError(null);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          updateMechanicLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            heading: position.coords.heading ?? undefined,
            speed: position.coords.speed ?? undefined,
          });
          setIsSharingLocation(true);
        },
        (error) => {
          let specificError = t('mapModal.geolocationError.default');
          switch (error.code) {
              case error.PERMISSION_DENIED:
                  specificError = t('mapModal.geolocationError.denied');
                  break;
              case error.POSITION_UNAVAILABLE:
                  specificError = t('mapModal.geolocationError.unavailable');
                  break;
              case error.TIMEOUT:
                  specificError = t('mapModal.geolocationError.timeout');
                  break;
          }
          console.error(`Geolocation error in Dashboard (Code: ${error.code}): ${error.message}`, error);
          setLocationError(`${t('dashboard.location.error')} ${specificError}`);
          setIsSharingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
      );
    }
  };
  
  const handleMechanicArrived = (jobId: string) => {
    stopLocationSharing();
    mechanicArrived(jobId);
  }

  const handleStartCompletion = (job: Job) => {
    setJobToFinalize(job);
    setInvoiceModalOpen(true);
  };

  const handleConfirmCompletion = (finalInvoice: PricingEstimate) => {
    if (jobToFinalize) {
        completeJob(jobToFinalize.id, finalInvoice);
    }
    setInvoiceModalOpen(false);
    setJobToFinalize(null);
    setStatus('Available');
  };

  const handleOpenRejectModal = (job: Job) => {
    setJobToReject(job);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    if (jobToReject) {
      rejectJob(jobToReject.id, reason);
    }
    setRejectModalOpen(false);
    setJobToReject(null);
  };

  const getStatusColor = (s: MechanicStatus) => {
    switch (s) {
      case 'Available': return 'bg-green-500';
      case 'On Job': return 'bg-yellow-500';
      case 'On Break': return 'bg-blue-500';
      case 'Offline': return 'bg-gray-500';
    }
  };

  if (!currentUser) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return newRequests.length > 0 ? (
          <div className="space-y-4">
            {newRequests.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                t={t}
                onAccept={() => acceptJob(job.id, currentUser.id)}
                onReject={() => handleOpenRejectModal(job)}
              />
            ))}
          </div>
        ) : <p className="text-center text-gray-500 py-8">{t('dashboard.new.empty')}</p>;
      
      case 'active':
        return assignedJob ? (
          <JobCard 
            job={assignedJob}
            t={t}
            onStartWork={() => handleMechanicArrived(assignedJob.id)}
            onComplete={() => handleStartCompletion(assignedJob)}
          />
        ) : <p className="text-center text-gray-500 py-8">{t('dashboard.active.empty')}</p>;
        
      case 'history':
        return jobHistory.length > 0 ? (
          <div className="space-y-4">
            {jobHistory.map(job => <JobCard key={job.id} job={job} t={t} />)}
          </div>
        ) : <p className="text-center text-gray-500 py-8">{t('dashboard.history.empty')}</p>;
    }
  };
  
  const TabButton: React.FC<{tab: DashboardTab, label: string, count?: number}> = ({tab, label, count}) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 pb-2 text-center font-semibold border-b-4 transition-colors ${
        activeTab === tab 
          ? 'text-red-500 border-red-500' 
          : 'text-gray-500 border-transparent hover:text-gray-800'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && 
        <span className="ml-2 text-xs font-bold text-white bg-red-500 rounded-full px-2 py-0.5">
          {count}
        </span>
      }
    </button>
  );

  return (
    <div className="h-screen w-screen bg-gray-100 p-4 sm:p-6 flex flex-col">
      <div className="max-w-xl mx-auto w-full flex-shrink-0">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
          <button onClick={logout} className="text-sm font-semibold text-red-500 hover:text-red-700">{t('dashboard.logout')}</button>
        </header>

        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-700">{t('dashboard.welcome', { name: currentUser.name })}</p>
            <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></span>
                <span className="text-sm font-semibold text-gray-700">{status}</span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-xl mx-auto w-full flex-1 overflow-y-auto pb-4">
        {locationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                <strong className="font-bold">Location Error: </strong>
                <span className="block sm:inline">{locationError}</span>
            </div>
        )}
        <div className="sticky top-0 bg-gray-100 py-2 z-10 mb-4">
          <nav className="flex bg-white p-1 rounded-lg shadow-sm">
            <TabButton tab="new" label={t('dashboard.tabs.new')} count={newRequests.length} />
            <TabButton tab="active" label={t('dashboard.tabs.active')} />
            <TabButton tab="history" label={t('dashboard.tabs.history')} />
          </nav>
        </div>
        {renderContent()}
      </main>

      <CancelModal 
        isOpen={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
      />
      
      <InvoiceEditorModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        onConfirm={handleConfirmCompletion}
        job={jobToFinalize}
      />
    </div>
  );
};

export default MechanicDashboard;