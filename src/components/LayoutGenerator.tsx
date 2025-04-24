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
                cursor: matrices.length >= 6 ? 'not-allowed' : 'pointer',
                opacity: matrices.length >= 6 ? 0.5 : 1
              }}
              onClick={handleAddMatrix}
              disabled={matrices.length >= 6}
            >
              Add Matrix ({matrices.length}/6)
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
                Save as PDF
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