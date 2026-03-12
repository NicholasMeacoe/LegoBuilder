"use client";

import React from 'react';
import { BuildSuggestion } from '@/types';

interface BuildSuggestionsProps {
  suggestions: BuildSuggestion[];
  isLoading: boolean;
}

export default function BuildSuggestions({ suggestions, isLoading }: BuildSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-100 p-8">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 font-medium text-center">Finding what you can build...</p>
        <p className="text-sm text-gray-400 text-center mt-2">This may take a moment.</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 p-4 min-h-[200px]">
        <p className="text-sm text-gray-400 text-center">Your suggestions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2">
      {suggestions.map((suggestion) => (
        <a 
          key={suggestion.setNum} 
          href={suggestion.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {suggestion.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={suggestion.imageUrl} alt={suggestion.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
            ) : (
              <span className="text-xs text-gray-400">No Image</span>
            )}
          </div>
          <div className="flex flex-col flex-grow">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {suggestion.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">{suggestion.setNum}</span>
              <span>•</span>
              <span>{suggestion.year}</span>
            </div>
            
            <div className="mt-auto pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 font-medium">Match: {Math.round(suggestion.matchPercentage)}%</span>
                <span className="text-gray-500">{Math.round((suggestion.matchPercentage / 100) * suggestion.numParts)} / {suggestion.numParts} parts</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full ${
                    suggestion.matchPercentage >= 90 ? 'bg-green-500' : 
                    suggestion.matchPercentage >= 50 ? 'bg-yellow-400' : 'bg-orange-500'
                  }`}
                  style={{ width: `${suggestion.matchPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
