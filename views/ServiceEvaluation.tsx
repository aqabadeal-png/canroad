import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Job } from '../types';
import { useJob } from '../contexts/JobContext';

interface ServiceEvaluationProps {
    job: Job;
    onDone: () => void;
}

const StarIcon: React.FC<{ filled: boolean; onClick: () => void; onMouseEnter: () => void; }> = ({ filled, onClick, onMouseEnter }) => (
    <svg 
        onClick={onClick} 
        onMouseEnter={onMouseEnter}
        className={`w-10 h-10 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ServiceEvaluation: React.FC<ServiceEvaluationProps> = ({ job, onDone }) => {
    const { t } = useLanguage();
    const { markJobAsEvaluated } = useJob();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        markJobAsEvaluated(job.id, rating);
        onDone();
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-2xl font-bold text-gray-800">{t('evaluation.completed')}</h1>
                
                <p className="text-gray-600 my-6">{t('evaluation.prompt')}</p>
                
                <div 
                    className="flex justify-center space-x-2 mb-8" 
                    onMouseLeave={() => setHoverRating(0)}
                    role="radiogroup"
                    aria-label="Service rating"
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star}
                            aria-label={`${star} star rating`}
                            role="radio"
                            aria-checked={rating === star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-full"
                        >
                            <StarIcon 
                                filled={(hoverRating || rating) >= star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                            />
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleSubmit} 
                    className="w-full h-12 px-6 font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {rating > 0 ? t('evaluation.submitRating') : t('evaluation.backHome')}
                </button>
            </div>
        </div>
    );
};

export default ServiceEvaluation;