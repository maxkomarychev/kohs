'use client';

import React, { useState } from 'react';
import Shape from './Shape';

type ShapeType = 'white' | 'black' | 
  'white-black-top-left' | 'white-black-top-right' | 
  'white-black-bottom-left' | 'white-black-bottom-right';

interface LayoutItem {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
}

const LayoutGenerator: React.FC = () => {
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [selectedShape, setSelectedShape] = useState<ShapeType>('white');
  const gridSize = 3; // 3x3 grid

  const handleAddShape = (x: number, y: number) => {
    const newShape: LayoutItem = {
      id: Date.now().toString(),
      type: selectedShape,
      x,
      y,
    };
    setLayout([...layout, newShape]);
  };

  const handleRemoveShape = (id: string) => {
    setLayout(layout.filter(item => item.id !== id));
  };

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        grid.push(
          <div
            key={`${i}-${j}`}
            className="border border-gray-200 w-20 h-20 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleAddShape(i, j)}
          >
            {layout.map(item => {
              if (item.x === i && item.y === j) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveShape(item.id);
                    }}
                  >
                    <Shape type={item.type} size={70} />
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Kohs Block Design Generator</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 'white' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('white')}
          >
            White
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 'black' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('black')}
          >
            Black
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 'white-black-top-left' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('white-black-top-left')}
          >
            W/B TL
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 'white-black-top-right' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('white-black-top-right')}
          >
            W/B TR
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 'white-black-bottom-left' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('white-black-bottom-left')}
          >
            W/B BL
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 'white-black-bottom-right' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('white-black-bottom-right')}
          >
            W/B BR
          </button>
        </div>
      </div>
      <div
        className="grid gap-0 border border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 5rem)`,
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default LayoutGenerator; 