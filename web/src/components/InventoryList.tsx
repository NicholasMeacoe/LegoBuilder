"use client";

import React from 'react';
import { LegoPart } from '@/types';

interface InventoryListProps {
  inventory: LegoPart[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function InventoryList({ inventory, onUpdateQuantity, onRemoveItem }: InventoryListProps) {
  if (inventory.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 p-4 min-h-[200px]">
        <p className="text-sm text-gray-400 text-center">No pieces identified yet.<br/>Upload an image to start.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2">
      {inventory.map((item) => (
        <div key={item.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-lg">
          <div className="w-12 h-12 bg-white rounded flex-shrink-0 border border-gray-200 overflow-hidden flex items-center justify-center">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">No Img</span>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-sm font-medium text-gray-800 truncate" title={item.name}>{item.name}</h3>
            <p className="text-xs text-gray-500">ID: {item.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="ml-2 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Remove item"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
