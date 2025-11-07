import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { User, UserRole } from '../types';

interface UserEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User | Omit<User, 'id'>) => void;
    userToEdit: User | null;
}

const UserEditorModal: React.FC<UserEditorModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const { t } = useLanguage();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'mechanic' as UserRole,
        isActive: true,
        password: '',
    });

    useEffect(() => {
        if (userToEdit) {
            setUserData({ ...userToEdit, password: '' });
        } else {
            setUserData({ name: '', email: '', phone: '', role: 'mechanic', isActive: true, password: '' });
        }
    }, [userToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        // In a real app, you'd handle password hashing here
        const dataToSave: any = { ...userData };

        if (userToEdit) {
            // If password field is empty during an edit, we don't want to change it.
            // So we remove the property from the update payload.
            if (!dataToSave.password) {
                delete dataToSave.password;
            }
            onSave({ ...dataToSave, id: userToEdit.id });
        } else {
            onSave(dataToSave);
        }
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setUserData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {userToEdit ? t('userEditor.editTitle') : t('userEditor.addTitle')}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('userEditor.name.label')}</label>
                        <input type="text" name="name" id="name" value={userData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('userEditor.email.label')}</label>
                        <input type="email" name="email" id="email" value={userData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('userEditor.phone.label')}</label>
                        <input type="tel" name="phone" id="phone" value={userData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">{t('userEditor.role.label')}</label>
                        <select name="role" id="role" value={userData.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500">
                            <option value="mechanic">Mechanic</option>
                            <option value="accounting">Accounting</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('userEditor.password.label')}</label>
                        <input type="password" name="password" id="password" value={userData.password} onChange={handleChange} placeholder={userToEdit ? t('userEditor.password.placeholder') : "Required for new users"} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">{t('userEditor.status.label')}</label>
                        <div className="flex items-center">
                            <span className={`mr-3 text-sm font-medium ${!userData.isActive ? 'text-gray-900' : 'text-gray-400'}`}>{t('userEditor.status.inactive')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="isActive" id="isActive" checked={userData.isActive} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                            <span className={`ml-3 text-sm font-medium ${userData.isActive ? 'text-gray-900' : 'text-gray-400'}`}>{t('userEditor.status.active')}</span>
                        </div>
                    </div>

                </div>

                <div className="mt-6 flex space-x-2">
                    <button onClick={onClose} className="w-1/2 h-12 px-6 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">{t('userEditor.cancel')}</button>
                    <button onClick={handleSave} className="w-1/2 h-12 px-6 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        {t('userEditor.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserEditorModal;