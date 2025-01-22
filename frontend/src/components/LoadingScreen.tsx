import React, { useEffect, useState } from "react";
import useAssetLoader from "../hooks/useAssetLoader";

interface LoadingState {
  type: "assets" | "map" | "complete";
  message: string;
  progress: number;
}

export const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const {
    loaded: assetsLoaded,
    currentFile,
    progress: assetProgress,
    errors,
  } = useAssetLoader();
  const [loadingState, setLoadingState] = useState<LoadingState>({
    type: "assets",
    message: "Loading game assets...",
    progress: 0,
  });
  const [fadeOut, setFadeOut] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (assetsLoaded) {
      // Start map generation
      setLoadingState({
        type: "map",
        message: "Generating game world...",
        progress: 0,
      });

      // Simulate map generation progress
      const interval = setInterval(() => {
        setLoadingState((prev) => {
          if (prev.type === "map") {
            const newProgress = prev.progress + 2;
            if (newProgress >= 100) {
              clearInterval(interval);
              setFadeOut(true);
              setTimeout(() => setShowLoading(false), 1000);
              return {
                type: "complete",
                message: "Ready!",
                progress: 100,
              };
            }
            return { ...prev, progress: newProgress };
          }
          return prev;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [assetsLoaded]);

  useEffect(() => {
    if (!assetsLoaded) {
      setLoadingState((prev) => ({
        ...prev,
        progress: assetProgress,
      }));
    }
  }, [assetProgress, assetsLoaded]);

  const getCurrentMessage = () => {
    switch (loadingState.type) {
      case "assets":
        return currentFile ? `Loading: ${currentFile}` : "Loading assets...";
      case "map":
        return `Generating world: ${Math.floor(loadingState.progress)}%`;
      case "complete":
        return "Welcome to FarmIt!";
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className={`transition-opacity duration-1000 ${
          showLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {showLoading && (
        <div
          className={`fixed inset-0 bg-gradient-to-b from-green-600 to-green-800 flex flex-col items-center justify-center transition-opacity duration-1000 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="mb-8 text-center">
            <h1 className="text-6xl font-bold text-yellow-300 mb-2 animate-bounce">
              FarmIt
            </h1>
            <p className="text-green-200 text-xl">
              {getCurrentMessage()}
            </p>
          </div>

          <div className="w-80 bg-green-900 rounded-lg p-1 shadow-xl border-2 border-green-400">
            <div
              className="h-6 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded transition-all duration-300 relative overflow-hidden"
              style={{ width: `${loadingState.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-yellow-200 animate-pulse" />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mt-4 text-red-400 bg-red-900 p-4 rounded-lg max-w-md">
              <h3 className="font-bold mb-2">Loading Errors:</h3>
              {errors.map((error, i) => (
                <p key={i} className="text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
