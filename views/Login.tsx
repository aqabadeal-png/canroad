import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';

interface LoginProps {
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onCancel }) => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (!user) {
        setError(t('login.error'));
      }
      // On success, the App component will automatically redirect.
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
           {logoError ? (
            <span className="text-3xl font-bold" style={{fontFamily: "'Poppins', sans-serif", color: "#283A6B"}}>CanRoad</span>
          ) : (
            <img 
              src="https://i.imghippo.com/files/qiq8147dUI.png" 
              alt="CanRoad logo" 
              className="w-[240px] h-[75px] object-contain"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <h1 className="text-xl font-bold text-center text-gray-800 mb-6">{t('login.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('login.email.label')}</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm h-12" 
            />
          </div>
          <div>
            <label htmlFor="password">{t('login.password.label')}</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm h-12" 
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="pt-2 space-y-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : t('login.submit')}
            </button>
             <button 
              type="button" 
              onClick={onCancel}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              {t('login.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;