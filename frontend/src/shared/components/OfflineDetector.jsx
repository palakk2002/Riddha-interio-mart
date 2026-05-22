import React, { useState, useEffect } from 'react';
import { FiWifiOff, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import api from '../utils/api';

const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      // Validate with server ping before declaring online
      checkConnectionQuality();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowWarning(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setShowWarning(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnectionQuality = async () => {
    setIsChecking(true);
    try {
      // Perform a lightweight ping to the backend
      await api.get('/products?limit=1');
      setIsOnline(true);
      setShowWarning(false);
    } catch (err) {
      // Even if navigator.onLine is true, backend might be unreachable
      setIsOnline(false);
      setShowWarning(true);
    } finally {
      setIsChecking(false);
    }
  };

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-slow">
      <div className="bg-gray-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-gray-800 flex flex-col gap-4">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
            <FiWifiOff size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-wide font-display text-gray-100 flex items-center gap-1.5">
              Network Disconnected
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            </h4>
            <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
              Your device lost connection to Riddha Mart. You are browsing in offline read-only mode.
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center justify-end border-t border-gray-800 pt-3">
          <button
            onClick={() => setShowWarning(false)}
            className="text-xs text-gray-400 font-bold px-3 py-1.5 hover:text-gray-200 transition-colors"
          >
            Dismiss
          </button>
          
          <button
            onClick={checkConnectionQuality}
            disabled={isChecking}
            className="flex items-center gap-1.5 bg-[#A29A88] text-gray-950 text-xs font-black px-4 py-2 rounded-xl hover:bg-white transition-all disabled:opacity-50"
          >
            <FiRefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
            {isChecking ? 'Checking...' : 'Recheck Pings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineDetector;
