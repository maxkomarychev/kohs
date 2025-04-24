'use client';

import React, { useState } from 'react';
import Shape from './Shape';
import html2canvas from 'html2canvas';

type ShapeType = 0 | 1 | 2 | 3 | 4 | 5;

const LayoutGenerator: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>(0);
  const [matrixInput, setMatrixInput] = useState<string>('000\n000\n000');
  const [matrices, setMatrices] = useState<string[]>([]);
  const gridSize = 3;

  const generateRandomMatrix = (): string => {
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        row.push(Math.floor(Math.random() * 6).toString());
      }
      rows.push(row.join(''));
    }
    return rows.join('\n');
  };

  const handleGenerateRandom = () => {
    const newMatrices: string[] = [];
    for (let i = 0; i < 25; i++) {
      newMatrices.push(generateRandomMatrix());
    }
    setMatrices(newMatrices);
  };

  const handleMatrixInput = (input: string) => {
    setMatrixInput(input);
  };

  const handleAddMatrix = () => {
    setMatrices([...matrices, matrixInput]);
    setMatrixInput(''); // Clear the textarea completely
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
            style={{ width: '5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              <Shape type={type} size={80} />
            </div>
          </div>
        );
      }
    }
    return grid;
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('layouts-grid');
    if (!element) return;

    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: false,
      background: '#ffffff'
    });

    // Create a link element
    const link = document.createElement('a');
    link.download = 'kohs-layouts.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
          Kohs Block Design Generator
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: selectedShape === 0 ? '#e5e7eb' : 'white',
              color: '#111827',
              border: '1px solid #e5e7eb'
            }}
            onClick={() => setSelectedShape(0)}
          >
            0 (White)
          </button>
          <button
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: selectedShape === 5 ? '#e5e7eb' : 'white',
              color: '#111827',
              border: '1px solid #e5e7eb'
            }}
            onClick={() => setSelectedShape(5)}
          >
            5 (Black)
          </button>
          <button
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: selectedShape === 1 ? '#e5e7eb' : 'white',
              color: '#111827',
              border: '1px solid #e5e7eb'
            }}
            onClick={() => setSelectedShape(1)}
          >
            1 (NW)
          </button>
          <button
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: selectedShape === 2 ? '#e5e7eb' : 'white',
              color: '#111827',
              border: '1px solid #e5e7eb'
            }}
            onClick={() => setSelectedShape(2)}
          >
            2 (NE)
          </button>
          <button
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: selectedShape === 3 ? '#e5e7eb' : 'white',
              color: '#111827',
              border: '1px solid #e5e7eb'
            }}
            onClick={() => setSelectedShape(3)}
          >
            3 (SE)
          </button>
          <button
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: selectedShape === 4 ? '#e5e7eb' : 'white',
              color: '#111827',
              border: '1px solid #e5e7eb'
            }}
            onClick={() => setSelectedShape(4)}
          >
            4 (SW)
          </button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
            Matrix Input (3x3)
          </label>
          <textarea
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              color: '#111827'
            }}
            rows={3}
            value={matrixInput}
            onChange={(e) => handleMatrixInput(e.target.value)}
            placeholder="000\n000\n000"
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={handleAddMatrix}
            >
              Add Matrix ({matrices.length})
            </button>
            <button
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={handleGenerateRandom}
            >
              Generate Random (25)
            </button>
            {matrices.length > 0 && (
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={handleExportPDF}
              >
                Save as PNG
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.25rem' }}>
            Each row represents a horizontal line of the grid from top to bottom
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 0, border: '1px solid #e5e7eb', gridTemplateColumns: `repeat(${gridSize}, 5rem)` }}>
        {renderGrid(matrixInput)}
      </div>
      <div id="layouts-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {matrices.map((matrix, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 0, border: '1px solid #e5e7eb', marginBottom: '0.5rem', gridTemplateColumns: `repeat(${gridSize}, 5rem)` }}>
              {renderGrid(matrix)}
            </div>
            <button
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
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