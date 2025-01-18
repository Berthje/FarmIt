import React from 'react';
import useAssetLoader from '../hooks/useAssetLoader';

export const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const { loaded, progress, errors } = useAssetLoader();

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-green-600 to-green-800 flex flex-col items-center justify-center">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-bold text-yellow-300 mb-2 animate-bounce">
            FarmIt
          </h1>
          <p className="text-green-200 text-xl">
            Your farming adventure awaits...
          </p>
        </div>

        {/* Loading Bar Section */}
        <div className="w-80 bg-green-900 rounded-lg p-1 shadow-xl border-2 border-green-400">
          <div
            className="h-6 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded transition-all duration-300 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-yellow-200 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-4 text-green-200">
          <p className="text-lg">Loading Assets: {Math.floor(progress)}%</p>
          {errors.length > 0 && (
            <div className="mt-4 text-red-400 bg-red-900 p-4 rounded-lg max-w-md">
              <h3 className="font-bold mb-2">Loading Errors:</h3>
              {errors.map((error, i) => (
                <p key={i} className="text-sm">{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="fixed bottom-0 w-full h-32 bg-gradient-to-t from-green-900 to-transparent" />
        <div className="fixed top-0 w-full h-32 bg-gradient-to-b from-green-900 to-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingScreen;
