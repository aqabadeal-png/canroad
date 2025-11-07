import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import { useJob } from '../contexts/JobContext';
import { useServices } from '../contexts/ServiceContext';
import { useContent } from '../contexts/ContentContext';
import { useServiceArea } from '../contexts/ServiceAreaContext';
import { Service, User, HomePageCard, ServiceArea } from '../types';
import ServiceEditorModal from '../components/ServiceEditorModal';
import UserEditorModal from '../components/UserEditorModal';
import HomePageCardEditorModal from '../components/HomePageCardEditorModal';
import ServiceAreaEditorModal from '../components/ServiceAreaEditorModal';
import { ICONS, MenuIcon } from '../constants';
import { TranslationKey } from '../i18n/translations';


type AccountingTab = 'reports' | 'services' | 'homeContent' | 'hr' | 'serviceAreas';

// --- ICONS for Sidebar ---
const ReportsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" /></svg>
);
const ServicesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 0 1 .796 0l.474.473a.563.563 0 0 1 0 .796l-2.471 2.471m-4.588 0 .943.943c.235.235.615.235.85 0l3.434-3.434c.235-.235.235-.615 0-.85l-.943-.943m-3.434 3.434-3.434-3.434a.563.563 0 0 1 0-.796l.474-.473a.563.563 0 0 1 .796 0l2.471 2.471" /></svg>
);
const HomeContentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
);
const HRIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.53-2.473M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.663M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
);
const ServiceAreasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-12v3.375c0 .621-.504 1.125-1.125 1.125h-9.75c-.621 0-1.125-.504-1.125-1.125V3.375m11.25 0c0-1.036-.84-1.875-1.875-1.875h-8.25c-1.035 0-1.875.84-1.875 1.875m11.25 0-1.125 1.125m-9.75 0L3.375 3.375m11.25 14.25-1.125-1.125m-9.75 0L3.375 18m11.25-3.375-1.125-1.125m-9.75 0L3.375 14.625" /></svg>
);
const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
);


const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
);

const AccountingDashboard: React.FC = () => {
    const { t } = useLanguage();
    const { currentUser, logout, users, updateUser, addUser } = useAuth();
    const { jobs } = useJob();
    const { services, addService, updateService } = useServices();
    const { homePageCards, addHomePageCard, updateHomePageCard } = useContent();
    const { serviceAreas, addServiceArea, updateServiceArea } = useServiceArea();

    const [activeTab, setActiveTab] = useState<AccountingTab>('reports');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    // State for modals
    const [isServiceEditorOpen, setServiceEditorOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [isUserEditorOpen, setUserEditorOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [isCardEditorOpen, setCardEditorOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<HomePageCard | null>(null);
    const [isAreaEditorOpen, setAreaEditorOpen] = useState(false);
    const [areaToEdit, setAreaToEdit] = useState<ServiceArea | null>(null);

    const stats = useMemo(() => {
        const completedJobs = jobs.filter(j => j.status === 'completed');
        const totalRevenue = completedJobs.reduce((sum, job) => {
            const bill = job.finalInvoice || job.initialEstimate;
            return sum + (bill.totalMin + bill.totalMax) / 2;
        }, 0);
        return {
            totalRevenue: totalRevenue.toFixed(2),
            jobsCompleted: completedJobs.length,
            avgJobValue: completedJobs.length > 0 ? (totalRevenue / completedJobs.length).toFixed(2) : '0.00',
        };
    }, [jobs]);
    
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(t('accounting.reports.title'), 20, 10);
        
        const completedJobs = jobs.filter(j => j.status === 'completed');
        
        (doc as any).autoTable({
            head: [['Date', 'Customer', 'Service', 'Final Amount (CAD)']],
            body: completedJobs.map(job => {
                const bill = job.finalInvoice || job.initialEstimate;
                const finalAmount = (bill.totalMin + bill.totalMax) / 2;
                return [
                    job.createdAt.toLocaleDateString(),
                    job.customerName,
                    job.serviceType,
                    `$${finalAmount.toFixed(2)}`
                ];
            }),
        });
        doc.save('canroad-report.pdf');
    };

    const handleSaveService = (service: Service | Omit<Service, 'id'>) => {
        if ('id' in service) {
            updateService(service);
        } else {
            addService(service);
        }
    };
    
    const handleSaveUser = (user: User | Omit<User, 'id'>) => {
        if ('id' in user) {
            updateUser(user);
        } else {
            addUser(user as Omit<User, 'id'>);
        }
    };
    
    const handleSaveCard = (card: HomePageCard | Omit<HomePageCard, 'id'>) => {
        if ('id' in card) {
            updateHomePageCard(card);
        } else {
            addHomePageCard(card as Omit<HomePageCard, 'id'>);
        }
    };
    
    const handleSaveArea = (area: ServiceArea | Omit<ServiceArea, 'id'>) => {
        if ('id' in area) {
            updateServiceArea(area);
        } else {
            addServiceArea(area as Omit<ServiceArea, 'id'>);
        }
    };
    
    const navItems: { tab: AccountingTab; labelKey: TranslationKey; icon: React.ReactNode }[] = [
        { tab: 'reports', labelKey: 'accounting.tabs.reports', icon: <ReportsIcon className="w-5 h-5" /> },
        { tab: 'services', labelKey: 'accounting.tabs.services', icon: <ServicesIcon className="w-5 h-5" /> },
        { tab: 'serviceAreas', labelKey: 'accounting.tabs.serviceAreas', icon: <ServiceAreasIcon className="w-5 h-5" /> },
        { tab: 'homeContent', labelKey: 'accounting.tabs.homeContent', icon: <HomeContentIcon className="w-5 h-5" /> },
        { tab: 'hr', labelKey: 'accounting.tabs.hr', icon: <HRIcon className="w-5 h-5" /> },
    ];
    
    const titleKeyMap: Record<AccountingTab, TranslationKey> = {
        reports: 'accounting.reports.title',
        services: 'accounting.services.title',
        homeContent: 'accounting.homeContent.title',
        hr: 'accounting.hr.title',
        serviceAreas: 'accounting.serviceAreas.title'
    };

    const renderContent = () => {
        const buttonKeyMap: Record<string, { key: TranslationKey, action: () => void }> = {
            reports: { key: 'accounting.exportPdf', action: exportPDF },
            services: { key: 'accounting.services.addNew', action: () => { setServiceToEdit(null); setServiceEditorOpen(true); } },
            homeContent: { key: 'accounting.homeContent.addNew', action: () => { setCardToEdit(null); setCardEditorOpen(true); } },
            hr: { key: 'accounting.hr.addNew', action: () => { setUserToEdit(null); setUserEditorOpen(true); } },
            serviceAreas: { key: 'accounting.serviceAreas.addNew', action: () => { setAreaToEdit(null); setAreaEditorOpen(true); } },
        };
        const actionButton = buttonKeyMap[activeTab];

        return (
            <>
                <div className="hidden md:flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">{t(titleKeyMap[activeTab])}</h1>
                    {actionButton && (
                        <button onClick={actionButton.action} className="px-5 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                            {t(actionButton.key)}
                        </button>
                    )}
                </div>
                 <div className="md:hidden flex justify-end mb-4">
                    {actionButton && (
                        <button onClick={actionButton.action} className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                            {t(actionButton.key)}
                        </button>
                    )}
                </div>
                
                {activeTab === 'reports' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard title={t('accounting.revenue')} value={`$${stats.totalRevenue}`} />
                        <StatCard title={t('accounting.jobsCompleted')} value={stats.jobsCompleted} />
                        <StatCard title={t('accounting.avgJobValue')} value={`$${stats.avgJobValue}`} />
                    </div>
                )}
                 {activeTab === 'services' && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                         {services.map((service, index) => {
                            const Icon = ICONS[service.icon as keyof typeof ICONS] || ICONS.WrenchIcon;
                            return (
                            <div key={service.id} onClick={() => { setServiceToEdit(service); setServiceEditorOpen(true); }} 
                                 className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${index < services.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <Icon className="w-8 h-8 mr-5 text-red-500" />
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{t(service.id as any, service.title)}</p>
                                    <p className="text-sm text-gray-500">${service.basePrice.toFixed(2)}</p>
                                </div>
                                <ICONS.ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                         )})}
                    </div>
                 )}
                 {activeTab === 'homeContent' && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                         {homePageCards.map((card, index) => (
                            <div key={card.id} onClick={() => { setCardToEdit(card); setCardEditorOpen(true); }} 
                                 className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${index < homePageCards.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <img src={card.imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg mr-5" />
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{t(card.title as any)}</p>
                                    <span className={`px-2 py-0.5 mt-1 inline-block text-xs font-semibold rounded-full ${card.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {card.isEnabled ? t('accounting.homeContent.visible') : t('accounting.homeContent.hidden')}
                                    </span>
                                </div>
                                <ICONS.ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                         ))}
                    </div>
                 )}
                 {activeTab === 'hr' && (
                     <div className="bg-white rounded-xl shadow overflow-hidden">
                         {users.map((user, index) => (
                            <div key={user.id} onClick={() => { setUserToEdit(user); setUserEditorOpen(true); }} 
                                 className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${index < users.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{user.name} <span className="text-sm font-normal text-gray-500 ml-2 capitalize">{user.role}</span></p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.isActive ? t('userEditor.status.active') : t('userEditor.status.inactive')}
                                </span>
                                <ICONS.ChevronRightIcon className="w-5 h-5 text-gray-400 ml-4" />
                            </div>
                         ))}
                    </div>
                 )}
                 {activeTab === 'serviceAreas' && (
                     <div className="bg-white rounded-xl shadow overflow-hidden">
                         {serviceAreas.map((area, index) => (
                            <div key={area.id} onClick={() => { setAreaToEdit(area); setAreaEditorOpen(true); }} 
                                 className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${index < serviceAreas.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <ICONS.MapPinIcon className="w-8 h-8 mr-5 text-blue-500" />
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{area.name}</p>
                                    <p className="text-sm text-gray-500">Radius: {area.radius / 1000} km</p>
                                </div>
                                <ICONS.ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                         ))}
                    </div>
                 )}
            </>
        )
    }

    return (
        <div className="h-screen w-screen bg-gray-50 md:flex font-sans">
             {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
                    aria-hidden="true"
                ></div>
            )}
            
            {/* --- Sidebar --- */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white flex flex-col shrink-0 border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-200">
                    <img src="https://i.imghippo.com/files/qiq8147dUI.png" alt="CanRoad logo" className="h-12" />
                    <p className="text-sm text-gray-600 mt-4">{t('accounting.welcome', { name: currentUser?.name })}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.tab}
                            onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                activeTab === item.tab 
                                ? 'bg-red-50 text-red-600' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            {item.icon}
                            <span>{t(item.labelKey)}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={logout} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                        <LogoutIcon className="w-5 h-5" />
                        <span>{t('dashboard.logout')}</span>
                    </button>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white shadow-sm flex justify-between items-center p-4">
                    <h1 className="text-lg font-bold text-gray-800">{t(titleKeyMap[activeTab])}</h1>
                     <button onClick={() => setSidebarOpen(true)} className="text-gray-600 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
                        <MenuIcon className="h-6 w-6" />
                     </button>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>


            {/* --- Modals --- */}
            <ServiceEditorModal isOpen={isServiceEditorOpen} onClose={() => setServiceEditorOpen(false)} onSave={handleSaveService} serviceToEdit={serviceToEdit} />
            <UserEditorModal isOpen={isUserEditorOpen} onClose={() => setUserEditorOpen(false)} onSave={handleSaveUser} userToEdit={userToEdit} />
            <HomePageCardEditorModal isOpen={isCardEditorOpen} onClose={() => setCardEditorOpen(false)} onSave={handleSaveCard} cardToEdit={cardToEdit} />
            <ServiceAreaEditorModal isOpen={isAreaEditorOpen} onClose={() => setAreaEditorOpen(false)} onSave={handleSaveArea} areaToEdit={areaToEdit} />
        </div>
    );
};

export default AccountingDashboard;
