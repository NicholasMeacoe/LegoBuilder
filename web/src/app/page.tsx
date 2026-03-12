"use client";

import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import InventoryList from '@/components/InventoryList';
import BuildSuggestions from '@/components/BuildSuggestions';
import { LegoPart, BuildSuggestion } from '@/types';

export default function Home() {
  const [inventory, setInventory] = useState<LegoPart[]>([]);
  const [suggestions, setSuggestions] = useState<BuildSuggestion[]>([]);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isFindingBuilds, setIsFindingBuilds] = useState(false);

  const handleImageSelected = async (file: File) => {
    setIsIdentifying(true);
    // TODO: Implement API call to Brickognize
    console.log("Image selected:", file.name);
    
    // Mocking API delay and response
    setTimeout(() => {
      const mockParts: LegoPart[] = [
        { id: '3001', name: 'Brick 2 x 4', quantity: 4, imageUrl: 'https://cdn.rebrickable.com/media/parts/elements/300121.jpg' },
        { id: '3003', name: 'Brick 2 x 2', quantity: 2, imageUrl: 'https://cdn.rebrickable.com/media/parts/elements/300321.jpg' },
        { id: '3022', name: 'Plate 2 x 2', quantity: 6, imageUrl: 'https://cdn.rebrickable.com/media/parts/elements/302221.jpg' },
      ];
      
      // Merge with existing inventory
      setInventory(prev => {
        const next = [...prev];
        mockParts.forEach(newPart => {
          const existing = next.find(p => p.id === newPart.id);
          if (existing) {
            existing.quantity += newPart.quantity;
          } else {
            next.push({ ...newPart });
          }
        });
        return next;
      });
      setIsIdentifying(false);
    }, 1500);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setInventory(prev => {
      if (newQuantity <= 0) {
        return prev.filter(p => p.id !== id);
      }
      return prev.map(p => p.id === id ? { ...p, quantity: newQuantity } : p);
    });
  };

  const handleRemoveItem = (id: string) => {
    setInventory(prev => prev.filter(p => p.id !== id));
  };

  const handleFindBuilds = () => {
    setIsFindingBuilds(true);
    // TODO: Implement API call to Rebrickable
    
    // Mocking API delay and response
    setTimeout(() => {
      setSuggestions([
        {
          setNum: '10696-1',
          name: 'Medium Creative Brick Box',
          year: 2015,
          themeId: 1,
          numParts: 484,
          imageUrl: 'https://cdn.rebrickable.com/media/sets/10696-1.jpg',
          url: 'https://rebrickable.com/sets/10696-1/',
          matchPercentage: 85
        },
        {
          setNum: 'MOC-12345',
          name: 'Mini Red Car MOC',
          year: 2023,
          themeId: 2,
          numParts: 55,
          imageUrl: 'https://cdn.rebrickable.com/media/mocs/moc-12345.jpg',
          url: 'https://rebrickable.com/mocs/MOC-12345/',
          matchPercentage: 100
        }
      ]);
      setIsFindingBuilds(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-8 border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2h2v2h6V2h2v2h4v16H3V4h4zm-2 2v12h14V6H5zm4 2h2v2H9V8zm6 0h2v2h-2V8z"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">LegoBuilder<span className="text-blue-600">AI</span></h1>
          </div>
          <nav className="text-sm font-medium text-gray-500 hidden sm:block">
            <span>Powered by Brickognize & Rebrickable</span>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Column 1: Upload / Camera */}
          <section className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 h-fit">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">1. Add Pieces</h2>
              <p className="text-sm text-gray-500 mt-1">Upload a photo to identify your Lego bricks.</p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} isLoading={isIdentifying} />
          </section>

          {/* Column 2: Inventory */}
          <section className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 flex-grow h-[600px]">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">2. Your Inventory</h2>
                <p className="text-sm text-gray-500 mt-1">{inventory.reduce((acc, p) => acc + p.quantity, 0)} total pieces</p>
              </div>
              {inventory.length > 0 && (
                <button 
                  onClick={() => setInventory([])}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <InventoryList 
              inventory={inventory} 
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
            
            <button 
              onClick={handleFindBuilds}
              disabled={inventory.length === 0 || isFindingBuilds}
              className={`w-full font-bold py-3 px-4 rounded-xl transition-all shadow-sm mt-auto ${
                inventory.length === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow text-white active:scale-[0.98]'
              }`}
            >
              {isFindingBuilds ? 'Searching database...' : 'Find What to Build'}
            </button>
          </section>

          {/* Column 3: Suggestions */}
          <section className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 flex-grow h-[600px]">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">3. Build Suggestions</h2>
              <p className="text-sm text-gray-500 mt-1">Sets and MOCs matching your pieces.</p>
            </div>
            
            <BuildSuggestions suggestions={suggestions} isLoading={isFindingBuilds} />
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 px-4">
          <p>LegoBuilder AI is a fan project and is not affiliated with the LEGO Group.</p>
        </div>
      </footer>
    </div>
  );
}
