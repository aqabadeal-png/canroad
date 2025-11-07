import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FloatingActionButton from './components/FloatingActionButton';
import SideMenu from './components/SideMenu';
import Home from './views/Home';
import Services from './views/Services';
import MapWrapper from './views/MapWrapper';
import Contact from './views/Contact';
import Pricing from './views/Pricing';
import MapModal from './views/MapModal';
import BookingForm from './components/BookingForm';
import LiveTracking from './views/LiveTracking';
import Login from './views/Login';
import MechanicDashboard from './views/MechanicDashboard';
import AdminDashboard from './views/AdminDashboard';
import AccountingDashboard from './views/AccountingDashboard';
import SearchingView from './views/SearchingView';
import ServiceEvaluation from './views/ServiceEvaluation';
import FinalInvoiceView from './views/FinalInvoiceView';
import { LocationData, Page, Job } from './types';
import { useLanguage } from './hooks/useLanguage';
import { useAuth } from './contexts/AuthContext';
import { useJob } from './contexts/JobContext';
import { usePricing } from './hooks/usePricing';
import { serviceTypeKeyMap } from './constants';
import { decode, decodeAudioData } from './utils';

const SuspendedJobBanner: React.FC<{ job: Job; onResume: () => void }> = ({ job, onResume }) => {
    const { t } = useLanguage();
    const serviceTypeKey = serviceTypeKeyMap[job.serviceType];
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.1)] p-3">
            <div className="flex items-center justify-between max-w-md mx-auto">
                <div>
                    <p className="font-bold text-blue-900">{t('suspended.title')}</p>
                    <p className="text-sm text-gray-600">{t(serviceTypeKey, job.serviceType)}</p>
                </div>
                <button
                    onClick={onResume}
                    className="px-4 py-2 font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {t('suspended.viewStatus')}
                </button>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { activeJob, jobs } = useJob();
  const { updatePricingInput } = usePricing();

  const [activePage, setActivePage] = useState<Page>('Home');
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [isBookingFormVisible, setBookingFormVisible] = useState(false);
  const [jobToEvaluate, setJobToEvaluate] = useState<Job | null>(null);
  const [jobToShowInvoice, setJobToShowInvoice] = useState<Job | null>(null);
  const [isCancelMessageVisible, setCancelMessageVisible] = useState(false);
  const [isJobViewSuspended, setJobViewSuspended] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [playedAudioNotifications, setPlayedAudioNotifications] = useState<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);


  useEffect(() => {
    if (!activeJob) {
      setJobViewSuspended(false);
    }
    
    if (activeJob?.status === 'cancelled') {
        setCancelMessageVisible(true);
        setTimeout(() => {
            setCancelMessageVisible(false);
            setActivePage('Home');
        }, 4000);
    }
  }, [activeJob]);

  // Effect to play acceptance audio
  useEffect(() => {
    if (activeJob?.status === 'assigned' && activeJob.acceptanceAudio && !playedAudioNotifications.has(activeJob.id)) {
        const playAudio = async () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            
            try {
                const audioBuffer = await decodeAudioData(
                    decode(activeJob.acceptanceAudio!),
                    audioContext,
                    24000,
                    1,
                );
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();

                // Mark as played
                setPlayedAudioNotifications(prev => new Set(prev).add(activeJob.id));
            } catch (error) {
                console.error("Failed to play acceptance audio:", error);
            }
        };
        playAudio();
    }
  }, [activeJob, playedAudioNotifications]);


  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleBookingRequest = useCallback(() => {
    setBookingFormVisible(false);
  }, []);

  const handleTrackingComplete = useCallback(() => {
    if (activeJob) {
      setJobToShowInvoice(activeJob);
    }
  }, [activeJob]);

  const handleInvoiceAcknowledged = useCallback((job: Job) => {
    setJobToShowInvoice(null);
    setJobToEvaluate(job);
  }, []);

  const handleSuspendJobView = useCallback(() => {
      setJobViewSuspended(true);
      setActivePage('Home');
  }, []);
  
  const handleLocationConfirm = useCallback((data: LocationData) => {
    setLocationData(data);
    updatePricingInput('location', data);
    setMapModalOpen(false);
    setBookingFormVisible(true);
  }, [updatePricingInput]);

  const jobForEvaluation = useMemo(() => 
    jobs.find(job => job.status === 'completed' && !job.isEvaluated), 
  [jobs]);

  const renderContent = () => {
    if (isBookingFormVisible && locationData) {
      return <BookingForm locationData={locationData} onSubmit={handleBookingRequest} onCancel={() => setBookingFormVisible(false)} />;
    }

    if (jobToShowInvoice) {
        return <FinalInvoiceView 
            job={jobToShowInvoice}
            onAcknowledge={() => handleInvoiceAcknowledged(jobToShowInvoice)}
        />
    }
    
    if (jobToEvaluate) {
        return <ServiceEvaluation 
            job={jobToEvaluate}
            onDone={() => {
              setJobToEvaluate(null);
              setActivePage('Home');
            }} 
        />;
    }
    
    if (isCancelMessageVisible) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <svg className="w-24 h-24 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="text-2xl font-bold text-gray-800">{t('app.cancel.title')}</h2>
                <p className="text-gray-600 mt-2">{t('app.cancel.message')}</p>
            </div>
        );
    }

    if (activeJob && !isJobViewSuspended && (!currentUser || currentUser.role === 'customer')) {
      switch (activeJob.status) {
        case 'pending':
          return <SearchingView />;
        case 'assigned':
        case 'arrived':
        case 'in_progress':
          return <LiveTracking customerLocation={activeJob.customerLocation} onComplete={handleTrackingComplete} onReturnHome={handleSuspendJobView} />;
        default:
          // This path should ideally not be taken due to the definition of `activeJob`
          // but as a safeguard, we return to home.
          setActivePage('Home');
          return <Home onBookNow={() => setMapModalOpen(true)}/>;
      }
    }

    switch (activePage) {
      case 'Home':
        return <Home onBookNow={() => setMapModalOpen(true)}/>;
      case 'Services':
        return <Services />;
      case 'Pricing':
        return <Pricing onBookNow={() => setMapModalOpen(true)} />;
      case 'Map':
        return <MapWrapper />;
      case 'Contact':
        return <Contact />;
      default:
        return <Home onBookNow={() => setMapModalOpen(true)} />;
    }
  };
  
  // --- ROLE-BASED ROUTING ---
  if (currentUser && currentUser.role === 'admin') {
    return <AdminDashboard />;
  }
  if (currentUser && currentUser.role === 'mechanic') {
    return <MechanicDashboard />;
  }
  if (currentUser && currentUser.role === 'accounting') {
    return <AccountingDashboard />;
  }

  if (isLoginVisible) {
    return <Login onCancel={() => setLoginVisible(false)} />;
  }

  // --- CUSTOMER VIEW ---
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col antialiased overflow-hidden">
      <Header onMenuClick={() => setSideMenuOpen(true)} />

      {isOffline && (
        <div className="bg-yellow-400 text-yellow-900 text-center p-2 font-medium">
          {t('app.offline')}
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setSideMenuOpen(false)}
        onShowLogin={() => {
          setSideMenuOpen(false);
          setLoginVisible(true);
        }}
        onNavigate={(page) => {
          setActivePage(page);
          setSideMenuOpen(false);
        }}
        jobForEvaluation={jobForEvaluation || null}
        onShowEvaluation={(job) => {
          setJobToEvaluate(job);
          setSideMenuOpen(false);
        }}
      />
      
      {activeJob && isJobViewSuspended && (
          <SuspendedJobBanner
              job={activeJob}
              onResume={() => setJobViewSuspended(false)}
          />
      )}
      
      {!isBookingFormVisible && !jobToEvaluate && !jobToShowInvoice && !isCancelMessageVisible && !activeJob && (
        <>
          <BottomNav activePage={activePage} onNavigate={setActivePage} />
          <FloatingActionButton onClick={() => setMapModalOpen(true)} />
        </>
      )}

      {isMapModalOpen && (
        <MapModal onClose={() => setMapModalOpen(false)} onConfirm={handleLocationConfirm} />
      )}
    </div>
  );
};

export default App;