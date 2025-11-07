import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useContent } from '../contexts/ContentContext';

// Skeleton Component for Home
const HomeSkeleton: React.FC = () => {
    const SkeletonCard: React.FC = () => (
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-3">
            <div className="rounded-xl mb-2 w-full aspect-square bg-gray-200"></div>
            <div className="h-3.5 bg-gray-200 rounded-md w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded-md w-full mx-auto"></div>
            <div className="mt-3 h-9 bg-gray-300 rounded-lg w-full"></div>
        </div>
    );
    
    return (
        <div className="p-4 animate-pulse">
            <div className="flex gap-4">
                <SkeletonCard />
                <SkeletonCard />
            </div>
            <div className="mt-8 text-center">
                <div className="h-7 bg-gray-200 rounded-md w-1/2 mx-auto mb-4"></div>
                <div className="space-y-6 text-left">
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="ml-4 h-5 bg-gray-200 rounded-md flex-1"></div>
                    </div>
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="ml-4 h-5 bg-gray-200 rounded-md flex-1"></div>
                    </div>
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="ml-4 h-5 bg-gray-200 rounded-md flex-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface HomeProps {
    onBookNow: () => void;
}

const Home: React.FC<HomeProps> = ({ onBookNow }) => {
    const { t } = useLanguage();
    const { homePageCards } = useContent();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200); // Simulate network delay
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <HomeSkeleton />;
    }

    return (
        <div className="p-4">
            <div className="flex gap-4 text-center">
                {homePageCards.filter(card => card.isEnabled).map(card => (
                    <div key={card.id} className="flex-1 bg-white rounded-2xl shadow-lg p-3 flex flex-col justify-between">
                        <div>
                            <div className="relative">
                                <img src={card.imageUrl} alt="" className="rounded-xl mb-2 w-full aspect-square object-cover" />
                                {card.comingSoon && (
                                    <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{t('home.wash.comingSoon')}</span>
                                )}
                            </div>
                            <h2 className="text-sm font-bold text-gray-800 leading-tight">{t(card.title as any)}</h2>
                            <p className="text-xs text-gray-500 mt-1 mb-3">{t(card.subtitle as any)}</p>
                        </div>
                        <button 
                            onClick={card.isPrimary ? onBookNow : undefined} 
                            disabled={card.comingSoon}
                            className={`w-full mt-auto py-2.5 px-2 text-xs font-bold text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-transform duration-200 ${
                                card.comingSoon 
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 focus:ring-red-500 hover:scale-105'
                            }`}
                        >
                            {t(card.ctaText as any)}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('home.howItWorksTitle')}</h2>
                <div className="space-y-6 text-left">
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white bg-blue-900 rounded-full shrink-0">1</div>
                        <p className="ml-4 font-medium text-gray-700">{t('home.step1')}</p>
                    </div>
                     <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white bg-blue-900 rounded-full shrink-0">2</div>
                        <p className="ml-4 font-medium text-gray-700">{t('home.step2')}</p>
                    </div>
                     <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white bg-blue-900 rounded-full shrink-0">3</div>
                        <p className="ml-4 font-medium text-gray-700">{t('home.step3')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;