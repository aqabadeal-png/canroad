import React, { useState } from 'react';
import { LocationData, ServiceType, VehicleType } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useJob } from '../contexts/JobContext';
import { usePricing } from '../hooks/usePricing';
import { TranslationKey } from '../i18n/translations';

// --- ICONS ---
const CarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.94V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h12v-2.94M4 11V9a2 2 0 0 1 2-2h4"/><path d="M19 12h-5"/><path d="M19 17h-5"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
);
const SuvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="10" rx="2" /><path d="M12 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/></svg>
);
const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 17.5V13H3V6a2 2 0 0 1 2-2h5.5l3.5 4H20a2 2 0 0 1 2 2v5.5a3.5 3.5 0 0 1-3.5 3.5H17"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
);
const EmergencyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
);
const TireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m2 12h2"/><path d="m20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
);
const DiagnosticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/><path d="M22 12h-2m-2 5.5-1.5-1.5m-7 0L8 17.5M12 6V4m-5.5 2L5 6.5m12.5 0L19 6.5"/></svg>
);
const OilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 12.5v8.5"/><path d="m12 21 4-4"/></svg>
);
const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
);


interface BookingFormProps {
  locationData: LocationData;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProgressBar: React.FC<{step: number, totalSteps: number}> = ({ step, totalSteps }) => (
    <div className="flex items-center">
        {[...Array(totalSteps)].map((_, i) => (
            <React.Fragment key={i}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i < step ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i + 1}
                </div>
                {i < totalSteps - 1 && <div className={`flex-1 h-1 ${i < step - 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>}
            </React.Fragment>
        ))}
    </div>
);


const BookingForm: React.FC<BookingFormProps> = ({ locationData, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const { createJob } = useJob();
  const { inputs, estimate, updatePricingInput } = usePricing();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimate) {
      console.error("Estimate not available. Cannot create job.");
      alert("An error occurred. Please try again.");
      return;
    }
    setIsSubmitting(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
        createJob({
          customerName: name,
          customerPhone: phone,
          customerLocation: locationData,
          initialEstimate: estimate,
          serviceType: inputs.serviceType,
          vehicleType: inputs.vehicleType,
          vehicleMake,
          vehicleModel,
        });
        onSubmit();
        // No need to setIsSubmitting(false) as the component will unmount
    }, 1000);
  };

  const serviceOptions: { value: ServiceType; label: string, icon: React.FC<any> }[] = [
    { value: 'generalMechanics', label: t('serviceType.generalMechanics'), icon: EmergencyIcon },
    { value: 'tireChange', label: t('serviceType.tireChange'), icon: TireIcon },
    { value: 'diagnostics', label: t('serviceType.diagnostics'), icon: DiagnosticsIcon },
    { value: 'oilChange', label: t('serviceType.oilChange'), icon: OilIcon },
    { value: 'filterReplacement', label: t('serviceType.filterReplacement'), icon: FilterIcon },
    { value: 'batteryBoost', label: t('serviceType.batteryBoost'), icon: DiagnosticsIcon },
  ];
  const vehicleOptions: { value: VehicleType; label: string; icon: React.FC<any> }[] = [
    { value: 'Car', label: t('vehicleType.car'), icon: CarIcon },
    { value: 'SUV', label: t('vehicleType.suv'), icon: SuvIcon },
    { value: 'Truck / Van', label: t('vehicleType.truck_van'), icon: TruckIcon },
  ];
  
  const SelectionCardGrid: React.FC<{
      options: { value: string; label: string; icon: React.FC<any> }[];
      selectedValue: string;
      onSelect: (value: any) => void;
      columns?: number;
  }> = ({ options, selectedValue, onSelect, columns = 3 }) => (
      <div className={`grid grid-cols-${columns} sm:grid-cols-5 gap-3`}>
          {options.map(option => (
              <button
                  type="button"
                  key={option.value}
                  onClick={() => onSelect(option.value)}
                  className={`p-3 border rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${selectedValue === option.value ? 'bg-red-50 border-red-500 ring-1 ring-red-500' : 'bg-white border-gray-300 hover:border-gray-400'}`}
              >
                  <option.icon className="w-8 h-8 mb-2 text-gray-700" />
                  <span className="text-xs font-semibold text-gray-800">{option.label}</span>
              </button>
          ))}
      </div>
  );
  
  const stepTitles: { [key: number]: TranslationKey } = {
      1: 'bookingForm.step1.title',
      2: 'bookingForm.step2.title',
      3: 'bookingForm.step3.title'
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <SelectionCardGrid
        options={serviceOptions}
        selectedValue={inputs.serviceType}
        onSelect={(value) => updatePricingInput('serviceType', value)}
        columns={3}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <SelectionCardGrid
        options={vehicleOptions}
        selectedValue={inputs.vehicleType}
        onSelect={(value) => updatePricingInput('vehicleType', value)}
        columns={3}
      />
      <div className="bg-white p-4 rounded-xl shadow-sm">
         <h3 className="block text-base font-semibold text-gray-800 mb-4">{t('bookingForm.vehicleInfo.title')}</h3>
         <div className="space-y-4">
             <div>
                <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">{t('bookingForm.vehicleMake.label')}</label>
                <input type="text" id="vehicleMake" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} placeholder={t('bookingForm.vehicleMake.placeholder')} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm h-12" />
            </div>
            <div>
                <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">{t('bookingForm.vehicleModel.label')}</label>
                <input type="text" id="vehicleModel" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder={t('bookingForm.vehicleModel.placeholder')} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm h-12" />
            </div>
         </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
      <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="space-y-4">
                   <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('bookingForm.name.label')}</label>
                      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm h-12" />
                  </div>
                  <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('bookingForm.phone.label')}</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        inputMode="numeric" 
                        pattern="[0-9]*" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                        required 
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm h-12" />
                  </div>
              </div>
          </div>
      </div>
  );

  const isStep1Valid = !!inputs.serviceType;
  const isStep2Valid = !!inputs.vehicleType && !!vehicleMake.trim() && !!vehicleModel.trim();
  const isStep3Valid = !!name.trim() && !!phone.trim();

  return (
    <div className="flex flex-col h-full bg-gray-50">
        <header className="p-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{t(stepTitles[step])}</h1>
                <button onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-900">{t('mapModal.cancel')}</button>
            </div>
             <p className="text-sm font-semibold text-gray-500 mb-2">{t('bookingForm.progress', { current: step, total: 3 })}</p>
            <ProgressBar step={step} totalSteps={3} />
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4">
            <form id="booking-form" onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </form>
        </main>

        <footer className="p-4 bg-white border-t-2 border-gray-100 flex-shrink-0">
            <div className="flex space-x-2">
                {step > 1 && (
                    <button type="button" onClick={() => setStep(s => s - 1)} className="w-1/3 h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                        {t('bookingForm.back')}
                    </button>
                )}
                 {step < 3 && (
                    <button type="button" onClick={() => setStep(s => s + 1)} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)} className="flex-1 h-12 px-6 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed">
                        {t('bookingForm.next')}
                    </button>
                )}
                {step === 3 && (
                    <button type="submit" form="booking-form" disabled={!isStep3Valid || isSubmitting} className="flex-1 h-12 flex justify-center items-center px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed">
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('bookingForm.submitting')}
                            </>
                        ) : t('bookingForm.submit')}
                    </button>
                )}
            </div>
        </footer>
    </div>
  );
};

export default BookingForm;