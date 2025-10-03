import React from 'react';
import { Spinner } from './Spinner';
import { IconSparkles, IconArrowPath } from './Icons';

interface TryOnButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  hasResult?: boolean;
}

export const TryOnButton: React.FC<TryOnButtonProps> = ({ onClick, isDisabled, isLoading, hasResult }) => {
  const buttonText = hasResult ? 'Regenerate' : 'Try On';
  const ButtonIcon = hasResult ? IconArrowPath : IconSparkles;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105"
    >
      {isLoading ? (
        <>
          <Spinner className="mr-3" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <ButtonIcon className="mr-3 h-6 w-6" />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
};
