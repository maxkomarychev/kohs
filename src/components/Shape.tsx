'use client';

import React from 'react';

// 0: white
// 5: black
// 1: white-black-north-west (top-left)
// 2: white-black-north-east (top-right)
// 3: white-black-south-east (bottom-right)
// 4: white-black-south-west (bottom-left)
type ShapeType = 0 | 1 | 2 | 3 | 4 | 5;

interface ShapeProps {
  type: ShapeType;
  size?: number;
  className?: string;
}

const Shape: React.FC<ShapeProps> = ({ type, size = 50, className = '' }) => {
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const renderDiagonal = (baseColor: string, triangleColor: string, clipPath: string) => {
    return (
      <div
        className={`relative ${className}`}
        style={baseStyle}
      >
        <div className={`absolute inset-0 bg-${baseColor}`} />
        <div 
          className={`absolute inset-0 bg-${triangleColor}`} 
          style={{ clipPath }}
        />
      </div>
    );
  };

  const renderShape = () => {
    switch (type) {
      case 0:
        return (
          <div
            className={`bg-white border border-gray-300 ${className}`}
            style={baseStyle}
          />
        );
      case 5:
        return (
          <div
            className={`bg-black ${className}`}
            style={baseStyle}
          />
        );
      case 1:
        return renderDiagonal('white', 'black', 'polygon(0% 0%, 100% 0%, 0% 100%)');
      case 2:
        return renderDiagonal('white', 'black', 'polygon(0% 0%, 100% 0%, 100% 100%)');
      case 3:
        return renderDiagonal('white', 'black', 'polygon(100% 0%, 0% 100%, 100% 100%)');
      case 4:
        return renderDiagonal('white', 'black', 'polygon(0% 0%, 0% 100%, 100% 100%)');
      default:
        return null;
    }
  };

  return renderShape();
};

export default Shape; 