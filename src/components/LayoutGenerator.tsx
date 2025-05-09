'use client';

import React, { useState } from 'react';
import Shape from './Shape';
import html2canvas from 'html2canvas';

type ShapeType = 0 | 1 | 2 | 3 | 4 | 5;

const LayoutGenerator: React.FC = () => {
  const [matrixInput, setMatrixInput] = useState<string>('000\n000\n000');
  const [matrices, setMatrices] = useState<string[]>([]);
  const [lockedCells, setLockedCells] = useState<boolean[][]>(Array(3).fill(null).map(() => Array(3).fill(true)));
  const [syncMode, setSyncMode] = useState<boolean>(false);
  const gridSize = 3;

  const generateRandomMatrix = (): string => {
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        // Only randomize if cell is selected (not locked)
        if (lockedCells[i][j]) {
          row.push(Math.floor(Math.random() * 6).toString());
        } else {
          // Keep the existing value for locked cells
          const currentRows = matrixInput.split('\n');
          row.push(currentRows[i]?.[j] || '0');
        }
      }
      rows.push(row.join(''));
    }
    return rows.join('\n');
  };

  const handleGenerateRandom = () => {
    const newMatrices: string[] = [];
    for (let i = 0; i < 6; i++) {
      newMatrices.push(generateRandomMatrix());
    }
    setMatrices(newMatrices);
  };

  const handleRandomizeCurrent = () => {
    setMatrixInput(generateRandomMatrix());
  };

  const handleResetLocks = () => {
    setLockedCells(Array(3).fill(null).map(() => Array(3).fill(true)));
  };

  const handleDeselectAll = () => {
    setLockedCells(Array(3).fill(null).map(() => Array(3).fill(false)));
  };

  const handleInvertSelection = () => {
    setLockedCells(lockedCells.map(row => row.map(cell => !cell)));
  };

  const handleResetMatrix = () => {
    setMatrixInput('000\n000\n000');
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

  const handleCellClick = (row: number, col: number) => {
    // Ensure matrix has the correct number of rows
    let rows = matrixInput.split('\n');
    while (rows.length < gridSize) {
      rows.push('0'.repeat(gridSize));
    }

    // Ensure each row has the correct number of columns
    rows = rows.map(row => {
      while (row.length < gridSize) {
        row += '0';
      }
      return row;
    });

    const newRows = [...rows];
    const currentValue = parseInt(newRows[row][col]) || 0;
    const newValue = ((currentValue + 1) % 6).toString();
    newRows[row] = newRows[row].substring(0, col) + newValue + newRows[row].substring(col + 1);

    if (syncMode && lockedCells[row][col]) {
      // If sync mode is enabled and the clicked cell is selected, update all other selected cells
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (lockedCells[y][x] && !(y === row && x === col)) {
            newRows[y] = newRows[y].substring(0, x) + newValue + newRows[y].substring(x + 1);
          }
        }
      }
    }

    setMatrixInput(newRows.join('\n'));
  };

  const handleLockCell = (row: number, col: number) => {
    const newLockedCells = [...lockedCells];
    newLockedCells[row][col] = !newLockedCells[row][col];
    setLockedCells(newLockedCells);
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
            style={{ 
              width: '5rem', 
              height: '5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
            onClick={() => handleCellClick(y, x)}
            className="cursor-pointer hover:bg-gray-100"
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

  const renderLockGrid = () => {
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grid.push(
          <div
            key={`lock-${x}-${y}`}
            style={{ 
              width: '5rem', 
              height: '2rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <input
              type="checkbox"
              checked={lockedCells[y][x]}
              onChange={() => handleLockCell(y, x)}
              style={{
                width: '1rem',
                height: '1rem',
                cursor: 'pointer'
              }}
            />
          </div>
        );
      }
    }
    return grid;
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('export-grid');
    if (!element) return;

    // Temporarily show the grid
    element.style.display = 'block';
    
    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Hide the grid again
    element.style.display = 'none';

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
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
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
            <button
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
              onClick={handleResetMatrix}
            >
              Reset Matrix
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
              Select Cells to Randomize
            </label>
            <div style={{ 
              display: 'grid', 
              gap: '0.5rem', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              backgroundColor: '#f9fafb'
            }}>
              {renderLockGrid()}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1
                }}
                onClick={handleResetLocks}
              >
                Select All
              </button>
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1
                }}
                onClick={handleDeselectAll}
              >
                Deselect All
              </button>
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1
                }}
                onClick={handleInvertSelection}
              >
                Invert Selection
              </button>
            </div>
          </div>
        </div>
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
            Generate Random (6)
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
            onClick={handleRandomizeCurrent}
          >
            Randomize Current
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
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={syncMode}
            onChange={(e) => setSyncMode(e.target.checked)}
            style={{
              width: '1rem',
              height: '1rem',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Sync selected cells
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ display: 'grid', gap: 0, border: '1px solid #e5e7eb', gridTemplateColumns: `repeat(${gridSize}, 5rem)` }}>
              {renderGrid(matrixInput)}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
              Select Cells to Randomize
            </label>
            <div style={{ 
              display: 'grid', 
              gap: '0.5rem', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              backgroundColor: '#f9fafb'
            }}>
              {renderLockGrid()}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1
                }}
                onClick={handleResetLocks}
              >
                Select All
              </button>
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1
                }}
                onClick={handleDeselectAll}
              >
                Deselect All
              </button>
              <button
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1
                }}
                onClick={handleInvertSelection}
              >
                Invert Selection
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Hidden export grid */}
      <div id="export-grid" style={{ display: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {matrices.map((matrix, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'grid', gap: 0, border: '1px solid #e5e7eb', gridTemplateColumns: `repeat(${gridSize}, 5rem)` }}>
                {renderGrid(matrix)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Visible grid with remove buttons */}
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