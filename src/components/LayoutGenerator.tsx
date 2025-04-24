'use client';

import React, { useState } from 'react';
import Shape from './Shape';

type ShapeType = 0 | 1 | 2 | 3 | 4 | 5;

interface LayoutItem {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
}

const LayoutGenerator: React.FC = () => {
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [selectedShape, setSelectedShape] = useState<ShapeType>(0);
  const [matrixInput, setMatrixInput] = useState<string>('000\n000\n000');
  const [matrices, setMatrices] = useState<string[]>(['000\n000\n000']);
  const gridSize = 3;

  const handleMatrixInput = (input: string) => {
    setMatrixInput(input);
    const rows = input.trim().split('\n');
    const newLayout: LayoutItem[] = [];
    
    rows.forEach((row, y) => {
      row.split('').forEach((cell, x) => {
        const type = parseInt(cell) as ShapeType;
        if (!isNaN(type) && type >= 0 && type <= 5) {
          newLayout.push({
            id: `${x}-${y}`,
            type,
            x,
            y,
          });
        }
      });
    });
    
    setLayout(newLayout);
  };

  const handleAddMatrix = () => {
    setMatrices([...matrices, matrixInput]);
  };

  const handleRemoveMatrix = (index: number) => {
    setMatrices(matrices.filter((_, i) => i !== index));
  };

  const handleAddShape = (x: number, y: number) => {
    const newShape: LayoutItem = {
      id: Date.now().toString(),
      type: selectedShape,
      x,
      y,
    };
    setLayout([...layout.filter(item => !(item.x === x && item.y === y)), newShape]);
    
    // Update matrix input
    const rows = matrixInput.split('\n');
    const newRows = [...rows];
    const cells = newRows[y].split('');
    cells[x] = selectedShape.toString();
    newRows[y] = cells.join('');
    setMatrixInput(newRows.join('\n'));
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grid.push(
          <div
            key={`${x}-${y}`}
            className="w-20 h-20 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleAddShape(x, y)}
          >
            {layout.map(item => {
              if (item.x === x && item.y === y) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                  >
                    <Shape type={item.type} size={78} />
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
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Kohs Block Design Generator</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 0 ? 'bg-gray-200' : 'bg-white'
            } text-gray-900`}
            onClick={() => setSelectedShape(0)}
          >
            0 (White)
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 5 ? 'bg-gray-200' : 'bg-white'
            } text-gray-900`}
            onClick={() => setSelectedShape(5)}
          >
            5 (Black)
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 1 ? 'bg-gray-200' : 'bg-white'
            } text-gray-900`}
            onClick={() => setSelectedShape(1)}
          >
            1 (NW)
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 2 ? 'bg-gray-200' : 'bg-white'
            } text-gray-900`}
            onClick={() => setSelectedShape(2)}
          >
            2 (NE)
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 3 ? 'bg-gray-200' : 'bg-white'
            } text-gray-900`}
            onClick={() => setSelectedShape(3)}
          >
            3 (SE)
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedShape === 4 ? 'bg-gray-200' : 'bg-white'
            } text-gray-900`}
            onClick={() => setSelectedShape(4)}
          >
            4 (SW)
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Matrix Input (3x3)
          </label>
          <textarea
            className="w-full p-2 border rounded font-mono text-gray-900"
            rows={3}
            value={matrixInput}
            onChange={(e) => handleMatrixInput(e.target.value)}
            placeholder="000\n000\n000"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAddMatrix}
            >
              Add Matrix
            </button>
          </div>
          <p className="text-sm text-gray-700 mt-1">
            Each row represents a horizontal line of the grid from top to bottom
          </p>
        </div>
      </div>
      <div className="grid gap-0 border border-gray-300" style={{ gridTemplateColumns: `repeat(${gridSize}, 5rem)` }}>
        {renderGrid()}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Saved Matrices</h2>
        <div className="space-y-4">
          {matrices.map((matrix, index) => (
            <div key={index} className="flex items-start gap-4">
              <textarea
                className="w-full p-2 border rounded font-mono text-gray-900"
                rows={3}
                value={matrix}
                readOnly
              />
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleRemoveMatrix(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayoutGenerator; 