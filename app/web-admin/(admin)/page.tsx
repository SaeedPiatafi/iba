// app/web-admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WebAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [networkDelay, setNetworkDelay] = useState(false);

  useEffect(() => {
    // Start redirect immediately
    const startTime = Date.now();
    
    const redirect = () => {
      try {
        router.push('/web-admin/teacher');
      } catch (error) {
        console.error('Redirect failed:', error);
      } finally {
        setRedirectAttempted(true);
      }
    };

    // Check if network is slow (if redirect takes more than 500ms)
    const networkCheck = setTimeout(() => {
      if (!redirectAttempted) {
        setNetworkDelay(true);
      }
    }, 500);

    // Attempt redirect with timeout
    const redirectTimeout = setTimeout(() => {
      redirect();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(networkCheck);
      clearTimeout(redirectTimeout);
    };
  }, [router, redirectAttempted]);

  // Show loader for at least 300ms to prevent flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <NetworkAwareLoader />
      </div>
    );
  }

  return null;
}

// Network-aware loader component
function NetworkAwareLoader() {
  const [dots, setDots] = useState(0);
  const [networkSpeed, setNetworkSpeed] = useState<'fast' | 'slow' | 'unknown'>('unknown');

  useEffect(() => {
    // Simulate checking network speed
    const checkNetworkSpeed = () => {
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const speed = connection.effectiveType;
          if (speed === 'slow-2g' || speed === '2g') {
            setNetworkSpeed('slow');
          } else {
            setNetworkSpeed('fast');
          }
        }
      }
    };

    checkNetworkSpeed();

    // Animate dots
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getLoaderText = () => {
    if (networkSpeed === 'slow') {
      return 'Network is slow, please wait';
    }
    return 'Loading';
  };

  const getDots = () => {
    return '.'.repeat(dots + 1);
  };

  return (
    <div className="text-center space-y-8">
      {/* Main loader */}
      <div className="relative mx-auto w-32 h-32">
        {/* Outer ring - pulse effect */}
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        
        {/* Middle ring - spinning */}
        <div className="absolute inset-4 border-4 border-blue-300 rounded-full animate-spin"></div>
        
        {/* Inner ring - network indicator */}
        <div className={`absolute inset-8 border-4 rounded-full ${
          networkSpeed === 'slow' ? 'border-orange-500 animate-pulse' : 'border-blue-500'
        }`}></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {getLoaderText()}
          <span className="inline-block w-8 text-left">{getDots()}</span>
        </h2>
        
        {/* Network status */}
        {networkSpeed === 'slow' && (
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Slow Network Detected
          </div>
        )}
        
        {/* Tips for slow network */}
        {networkSpeed === 'slow' && (
          <div className="max-w-md mx-auto text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-1">Tips for better experience:</p>
            <ul className="text-left space-y-1">
              <li>• Connect to a stronger Wi-Fi signal</li>
              <li>• Move closer to your router</li>
              <li>• Check your internet connection</li>
            </ul>
          </div>
        )}

        {/* Progress indicator */}
        <div className="w-64 mx-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Loading</span>
            <span>{networkSpeed === 'slow' ? 'This may take longer' : 'Almost there'}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                networkSpeed === 'slow' ? 'bg-orange-500 w-3/4 animate-pulse' : 'bg-blue-600 w-full'
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}