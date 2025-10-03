
import React from 'react';
import { Spinner } from './Spinner';
import { IconPhoto, IconExclamationTriangle, IconDownload, IconArrowPath } from './Icons';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onDownload: () => void;
  onRetry: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading, error, onDownload, onRetry }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <Spinner />
          <p className="mt-4 text-center">Generating your new look...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
          <IconExclamationTriangle className="w-12 h-12 mb-4" />
          <p className="font-semibold text-center">An error occurred</p>
          <p className="text-sm text-red-300/80 text-center mt-1 mb-4">{error}</p>
          {error.toLowerCase().includes('safety policies') && (
              <p className="text-xs text-gray-400 text-center mb-4">
                  This can happen if the images violate content policies. Please try using different person or outfit images.
              </p>
          )}
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
            aria-label="Try generating the image again"
          >
            <IconArrowPath className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      );
    }
    if (generatedImage) {
      return (
        <div className="relative w-full h-full group">
          <img
            src={generatedImage}
            alt="Generated try-on"
            className="object-contain w-full h-full rounded-md"
          />
          <button
            onClick={onDownload}
            className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Download image"
            title="Download Image"
          >
            <IconDownload className="w-5 h-5" />
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <IconPhoto className="w-16 h-16 mb-4" />
        <p className="font-semibold">Your result will appear here</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col shadow-lg">
      <h2 className="text-lg font-semibold text-center text-gray-300 mb-4">3. Result</h2>
      <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-md aspect-w-1 aspect-h-1">
        {renderContent()}
      </div>
    </div>
  );
};
