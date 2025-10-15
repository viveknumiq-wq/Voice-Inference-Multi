'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCases, SupportedLanguage, hasMultipleLanguages } from './demo-config';
import LanguageSelector from './components/LanguageSelector';

export default function Home() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Light Sky Blue Glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #93c5fd, transparent)
          `,
        }} 
      />
      
   
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Language Selector */}
        {/* {hasMultipleLanguages() && (
          <div className="absolute top-4 right-4">
            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={handleLanguageChange} 
            />
          </div>
        )}
        {/* Title and Subtitle */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Voice AI Demo Platform</h1>
          <p className="text-lg text-gray-600">Choose from different AI voice assistant use cases</p>
        </div>
        
        {/* Use Cases Grid */}
        <div className="max-w-6xl mx-auto w-full px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {Object.entries(useCases).map(([key, config]) => (
              <Link 
                key={key}
                href={config.route}
                className="group block p-8 border border-gray-300 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {config.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {config.overview}
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg group-hover:bg-blue-600 transition-colors">
                      Try Demo →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Each demo showcases a different AI voice assistant use case
          </p>
        </div>
      </div>
    </div>
  )
}