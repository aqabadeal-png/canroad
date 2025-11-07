import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../contexts/AuthContext';
import { useJob } from '../contexts/JobContext';
import { Job, User } from '../types';

// --- ICONS ---
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197m0 0A7.962 7.962 0 0112 6.354a7.962 7.962 0 013 5.449m0 0a4.995 4.995 0 01-3 5.197" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const WrenchScrewdriverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-4 h-4 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const getStatusChip = (status: Job['status']) => {
    const statusMap: Record<Job['status'], { text: string; color: string }> = {
        pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        assigned: { text: 'Assigned', color: 'bg-blue-100 text-blue-800' },
        arrived: { text: 'Arrived', color: 'bg-purple-100 text-purple-800' },
        in_progress: { text: 'In Progress', color: 'bg-indigo-100 text-indigo-800' },
        completed: { text: 'Completed', color: 'bg-green-100 text-green-800' },
        cancelled: { text: 'Cancelled', color: 'bg-red-100 text-red-800' },
    };
    const { text, color } = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>;
};


const AdminDashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { jobs, allMechanics, mechanicLocation } = useJob();

    const stats = useMemo(() => {
        const activeJobs = jobs.filter(j => ['assigned', 'arrived', 'in_progress'].includes(j.status));
        const assignedMechanicIds = new Set(activeJobs.map(j => j.mechanicId));
        const today = new Date().toDateString();
        return {
            pendingRequestsCount: jobs.filter(j => j.status === 'pending').length,
            activeJobsCount: activeJobs.length,
            availableMechanicsCount: allMechanics.length - assignedMechanicIds.size,
            completedTodayCount: jobs.filter(j => j.status === 'completed' && j.createdAt.toDateString() === today).length,
        };
    }, [jobs, allMechanics]);

    const mechanicIcon = L.divIcon({
        html: '🚗',
        className: 'text-3xl',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
    });

    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome, {currentUser?.name}</p>
                </div>
                <button onClick={logout} className="text-sm font-semibold text-red-500 hover:text-red-700">Logout</button>
            </header>
            
            <main className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title="Pending Requests" value={stats.pendingRequestsCount} icon={<ClockIcon />} />
                    <StatCard title="Active Jobs" value={stats.activeJobsCount} icon={<WrenchScrewdriverIcon />} />
                    <StatCard title="Available Mechanics" value={stats.availableMechanicsCount} icon={<UsersIcon />} />
                    <StatCard title="Completed Today" value={stats.completedTodayCount} icon={<CheckCircleIcon />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Live Mechanic Locations</h2>
                        <div className="h-96 rounded-lg overflow-hidden">
                             <MapContainer center={[56.1304, -106.3468]} zoom={4} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {mechanicLocation && (
                                    <Marker position={[mechanicLocation.lat, mechanicLocation.lng]} icon={mechanicIcon}>
                                        <Popup>Mechanic on active job</Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </div>
                     <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Mechanic Roster</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Name</th>
                                        <th scope="col" className="px-4 py-3">Status</th>
                                        <th scope="col" className="px-4 py-3">Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allMechanics.map(mech => {
                                        const isOnJob = jobs.some(j => j.mechanicId === mech.id && ['assigned', 'arrived', 'in_progress'].includes(j.status));
                                        return (
                                            <tr key={mech.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{mech.name}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isOnJob ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                        {isOnJob ? 'On Job' : 'Available'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{mech.phone}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">All Jobs</h2>
                     <div className="overflow-x-auto max-h-[50vh]">
                         <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Service</th>
                                    <th className="px-4 py-3">Mechanic</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Rating</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...jobs].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).map(job => {
                                    const mechanic = allMechanics.find(m => m.id === job.mechanicId);
                                    return (
                                        <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{job.customerName}</div>
                                                <div className="text-gray-500">{job.customerPhone}</div>
                                            </td>
                                            <td className="px-4 py-3">{job.serviceType}</td>
                                            <td className="px-4 py-3">{mechanic?.name || 'Unassigned'}</td>
                                            <td className="px-4 py-3">
                                                {getStatusChip(job.status)}
                                                {job.status === 'cancelled' && job.cancellationReason && (
                                                    <div className="text-xs text-gray-500 mt-1 italic max-w-xs">
                                                        {job.cancellationReason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">{job.rating ? <StarRating rating={job.rating} /> : 'N/A'}</td>
                                            <td className="px-4 py-3">{job.createdAt.toLocaleDateString()}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                         </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;