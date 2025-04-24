'use client';

import React, { useState } from 'react';
import Shape from './Shape';

type ShapeType = 'white' | 'black' | 'triangle';

interface LayoutItem {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
}

const LayoutGenerator: React.FC = () => {
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [selectedShape, setSelectedShape] = useState<ShapeType>('white');
  const [gridSize, setGridSize] = useState(8);

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
            className="border border-gray-200 w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-gray-100"
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
                    <Shape type={item.type} size={40} />
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
        <h1 className="text-2xl font-bold mb-4">Kohs Layout Generator</h1>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedShape === 'white' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('white')}
          >
            White
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedShape === 'black' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('black')}
          >
            Black
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedShape === 'triangle' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelectedShape('triangle')}
          >
            Triangle
          </button>
        </div>
      </div>
      <div
        className="grid gap-0 border border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 3rem)`,
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default LayoutGenerator; 