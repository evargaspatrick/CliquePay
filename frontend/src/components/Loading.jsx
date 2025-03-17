import { useState, useEffect } from 'react';

const Loading = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-green-600 rounded-full animate-spin"></div>
                
                {/* Loading text */}
                <div className="text-lg font-semibold text-gray-700 w-24 text-center">
                    Loading{dots}
                </div>
            </div>
        </div>
    );
};

export default Loading;