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
}

const Shape: React.FC<ShapeProps> = ({ type, size = 50 }) => {
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    position: 'relative' as const,
    backgroundColor: 'white',
  };

  const renderDiagonal = (path: string) => {
    return (
      <div style={baseStyle}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path d={path} fill="black" />
        </svg>
      </div>
    );
  };

  switch (type) {
    case 0:
      return <div style={baseStyle} />;
    case 5:
      return <div style={{ ...baseStyle, backgroundColor: 'black' }} />;
    case 1:
      return renderDiagonal('M 0,0 L 100,0 L 0,100 Z');
    case 2:
      return renderDiagonal('M 0,0 L 100,0 L 100,100 Z');
    case 3:
      return renderDiagonal('M 100,0 L 0,100 L 100,100 Z');
    case 4:
      return renderDiagonal('M 0,0 L 0,100 L 100,100 Z');
    default:
      return null;
  }
};

export default Shape; 