'use client';

import React, { useState } from 'react';
import Shape from './Shape';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type ShapeType = 0 | 1 | 2 | 3 | 4 | 5;

const LayoutGenerator: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>(0);
  const [matrixInput, setMatrixInput] = useState<string>('000\n000\n000');
  const [matrices, setMatrices] = useState<string[]>(['000\n000\n000']);
  const gridSize = 3;

  const handleMatrixInput = (input: string) => {
    setMatrixInput(input);
  };

  const handleAddMatrix = () => {
    if (matrices.length < 6) {
      setMatrices([...matrices, matrixInput]);
    }
  };

  const handleRemoveMatrix = (index: number) => {
    setMatrices(matrices.filter((_, i) => i !== index));
  };

  const renderGrid = (matrix: string) => {
    const grid = [];
    const rows = matrix.trim().split('\n');
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cellValue = rows[y]?.[x] || '0';
        const type = parseInt(cellValue) as ShapeType;
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className="w-20 h-20 flex items-center justify-center"
          >
            <div className="relative">
              <Shape type={type} size={80} />
            </div>
          </div>
        );
      }
    }
    return grid;
  };

  const handleExportPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const element = document.getElementById('layouts-grid');
    if (!element) return;

    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: false,
      background: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('kohs-layouts.pdf');
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
              disabled={matrices.length >= 6}
            >
              Add Matrix ({matrices.length}/6)
            </button>
            {matrices.length > 0 && (
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleExportPDF}
              >
                Save as PDF
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 mt-1">
            Each row represents a horizontal line of the grid from top to bottom
          </p>
        </div>
      </div>
      <div className="grid gap-0 border border-gray-300" style={{ gridTemplateColumns: `repeat(${gridSize}, 5rem)` }}>
        {renderGrid(matrixInput)}
      </div>
      <div id="layouts-grid" className="mt-8 grid grid-cols-3 gap-4">
        {matrices.map((matrix, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="grid gap-0 border border-gray-300 mb-2" style={{ gridTemplateColumns: `repeat(${gridSize}, 5rem)` }}>
              {renderGrid(matrix)}
            </div>
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
  );
};

export default LayoutGenerator; 