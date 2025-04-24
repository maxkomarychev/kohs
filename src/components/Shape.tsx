'use client';

import React from 'react';

type ShapeType = 'white' | 'black' | 'triangle';

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
      case 'triangle':
        return (
          <div
            className={`${className}`}
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              backgroundColor: 'black',
            }}
          />
        );
      default:
        return null;
    }
  };

  return renderShape();
};

export default Shape; 