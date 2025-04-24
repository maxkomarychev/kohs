'use client';

import React from 'react';

type ShapeType = 'white' | 'black' | 
  'white-black-top-left' | 'white-black-top-right' | 
  'white-black-bottom-left' | 'white-black-bottom-right';

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
      case 'white':
        return (
          <div
            className={`bg-white border border-gray-300 ${className}`}
            style={baseStyle}
          />
        );
      case 'black':
        return (
          <div
            className={`bg-black ${className}`}
            style={baseStyle}
          />
        );
      case 'white-black-top-left':
        return renderDiagonal('white', 'black', 'polygon(0% 0%, 100% 0%, 0% 100%)');
      case 'white-black-top-right':
        return renderDiagonal('white', 'black', 'polygon(0% 0%, 100% 0%, 100% 100%)');
      case 'white-black-bottom-left':
        return renderDiagonal('white', 'black', 'polygon(0% 0%, 0% 100%, 100% 100%)');
      case 'white-black-bottom-right':
        return renderDiagonal('white', 'black', 'polygon(100% 0%, 0% 100%, 100% 100%)');
      default:
        return null;
    }
  };

  return renderShape();
};

export default Shape; 