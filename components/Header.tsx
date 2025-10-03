import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <span className="text-3xl mr-3" role="img" aria-label="Smiling face with sunglasses emoji">😎</span>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Outfit Trial by Tanvir
            </h1>
        </div>
      </div>
    </header>
  );
};
