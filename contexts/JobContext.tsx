import React, { createContext, useState, ReactNode, useContext, useMemo, useEffect } from 'react';
import { Job, LocationData, MechanicLocation, User, PricingEstimate, ServiceType, VehicleType } from '../types';
import { useAuth } from './AuthContext';
import { GoogleGenAI, Modality } from "@google/genai";

// --- MOCK DATA FOR DEMONSTRATION ---
const mockCompletedJob: Job = {
  id: 'job-history-1',
  customerId: 'cust-history-1',
  customerName: 'John Doe',
  customerPhone: '555-111-2222',
  mechanicId: 'mech-01',
  status: 'completed',
  customerLocation: { lat: 43.6629, lng: -79.3957, address: '200 Bloor St W, Toronto, ON' },
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  initialEstimate: { totalMin: 120, totalMax: 140, etaMin: 20, etaMax: 25, breakdown: [], lockedUntil: null },
  serviceType: 'tireChange',
  vehicleType: 'SUV',
  isEvaluated: false,
};

const mockCancelledJob: Job = {
  id: 'job-history-2',
  customerId: 'cust-history-2',
  customerName: 'Jane Smith',
  customerPhone: '555-333-4444',
  mechanicId: 'mech-01',
  status: 'cancelled',
  customerLocation: { lat: 43.6426, lng: -79.3871, address: '1 Front St W, Toronto, ON' },
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  initialEstimate: { totalMin: 90, totalMax: 110, etaMin: 15, etaMax: 20, breakdown: [], lockedUntil: null },
  serviceType: 'generalMechanics',
  vehicleType: 'Car',
  isEvaluated: false,
  cancellationReason: 'Service no longer needed',
};
// --- END MOCK DATA ---


interface CreateJobData {
  customerLocation: LocationData;
  customerName: string;
  customerPhone: string;
  initialEstimate: PricingEstimate;
  serviceType: ServiceType;
  vehicleType: VehicleType;
  vehicleMake?: string;
  vehicleModel?: string;
}

interface JobContextType {
  jobs: Job[];
  allMechanics: User[];
  activeJob: Job | null; // The single, non-terminal job for the current customer
  mechanicLocation: MechanicLocation | null;
  assignedMechanic: User | null;
  createJob: (data: CreateJobData) => void;
  updateMechanicLocation: (location: Omit<MechanicLocation, 'updatedAt'>) => void;
  mechanicArrived: (jobId: string) => void;
  completeJob: (jobId: string, finalInvoice: PricingEstimate) => void;
  cancelJob: (jobId: string, reason: string) => void;
  acceptJob: (jobId: string, mechanicId: string) => void;
  rejectJob: (jobId: string, reason: string) => void;
  markJobAsEvaluated: (jobId: string, rating: number) => void;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { users } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([mockCompletedJob, mockCancelledJob]);
    const [mechanicLocation, setMechanicLocation] = useState<MechanicLocation | null>(null);
    const [assignedMechanic, setAssignedMechanic] = useState<User | null>(null);

    const allMechanics = useMemo(() => users.filter(u => u.role === 'mechanic'), [users]);

    const createJob = (data: CreateJobData) => {
        const newJob: Job = {
            id: `job-${Date.now()}`,
            customerId: 'cust-guest', // For this demo, all jobs are for a guest user
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            mechanicId: null,
            status: 'pending',
            customerLocation: data.customerLocation,
            createdAt: new Date(),
            initialEstimate: data.initialEstimate,
            serviceType: data.serviceType,
            vehicleType: data.vehicleType,
            vehicleMake: data.vehicleMake,
            vehicleModel: data.vehicleModel,
            isEvaluated: false,
        };
        setJobs(prev => [...prev, newJob]);
        setAssignedMechanic(null);
        console.log("New job created, pending assignment:", newJob);
    };

    const updateMechanicLocation = (location: Omit<MechanicLocation, 'updatedAt'>) => {
        const newLocation: MechanicLocation = { ...location, updatedAt: new Date() };
        setMechanicLocation(newLocation);
    };
    
    const mechanicArrived = (jobId: string) => {
        setJobs(prev => prev.map(job => 
            job.id === jobId ? { ...job, status: 'arrived' } : job
        ));
    };
    
    const completeJob = (jobId: string, finalInvoice: PricingEstimate) => {
        setJobs(prev => prev.map(job => 
            job.id === jobId ? { ...job, status: 'completed', finalInvoice } : job
        ));
        setMechanicLocation(null);
    };

    const cancelJob = (jobId: string, reason: string) => {
        setJobs(prev => prev.map(job => 
            job.id === jobId ? { ...job, status: 'cancelled', cancellationReason: reason } : job
        ));
        console.log(`Job ${jobId} cancelled. Reason: ${reason}`);
        setMechanicLocation(null);
    };

    const acceptJob = (jobId: string, mechanicId: string) => {
        const mechanic = allMechanics.find(m => m.id === mechanicId);
        if (!mechanic) return;

        // Immediately update UI for the mechanic for a responsive feel
        setJobs(prev => prev.map(job => 
            job.id === jobId ? { ...job, status: 'assigned', mechanicId: mechanic.id } : job
        ));
        setAssignedMechanic(mechanic);
        console.log("Job accepted by mechanic:", mechanic.name);

        // Generate audio in the background and update the job object later
        const generateAndSetAudio = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `Great news! Your mechanic, ${mechanic.name}, has accepted your request and is now on the way.`;
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: prompt }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                        },
                    },
                });
                const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (audioBase64) {
                    setJobs(prev => prev.map(job => 
                        job.id === jobId ? { ...job, acceptanceAudio: audioBase64 } : job
                    ));
                    console.log("Generated and set acceptance audio for job:", jobId);
                }
            } catch (error) {
                console.error("Failed to generate TTS audio notification:", error);
            }
        };

        generateAndSetAudio();
    };
    
    const rejectJob = (jobId: string, reason: string) => {
        console.log(`Job ${jobId} rejected by mechanic with reason:`, reason);
        cancelJob(jobId, reason);
    };

    const markJobAsEvaluated = (jobId: string, rating: number) => {
        setJobs(prev => prev.map(job => 
            job.id === jobId ? { ...job, isEvaluated: true, rating: rating } : job
        ));
        console.log(`Job ${jobId} marked as evaluated with rating: ${rating}.`);
    };

    // Derived state for the customer view to simplify logic in App.tsx and other components.
    const activeJob = useMemo(() => 
        jobs.find(job => 
            job.customerId === 'cust-guest' && 
            ['pending', 'assigned', 'arrived', 'in_progress'].includes(job.status)
        ) || null,
    [jobs]);

    // When the customer's active job is assigned, update the assignedMechanic state.
    // This is primarily for the customer view.
    useEffect(() => {
        if (activeJob?.mechanicId && !assignedMechanic) {
            const mechanic = allMechanics.find(m => m.id === activeJob.mechanicId);
            setAssignedMechanic(mechanic || null);
        } else if (!activeJob && assignedMechanic) {
            setAssignedMechanic(null);
        }
    }, [activeJob, assignedMechanic, allMechanics]);


    return (
        <JobContext.Provider value={{ jobs, allMechanics, activeJob, mechanicLocation, assignedMechanic, createJob, updateMechanicLocation, mechanicArrived, completeJob, cancelJob, acceptJob, rejectJob, markJobAsEvaluated }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};