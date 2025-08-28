import React from 'react';

interface WarehouseGridProps {
  width: number;
  height: number;
  gridSize: number;
}

const WarehouseGrid: React.FC<WarehouseGridProps> = ({ width, height, gridSize }) => {
  const gridLines = [];
  
  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#e5e7eb"
        strokeWidth="1"
        opacity={x % (gridSize * 2) === 0 ? "0.6" : "0.3"}
      />
    );
  }
  
  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth="1"
        opacity={y % (gridSize * 2) === 0 ? "0.6" : "0.3"}
      />
    );
  }

  return (
    <svg 
      className="warehouse-grid"
      width={width} 
      height={height}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {gridLines}
    </svg>
  );
};

export default WarehouseGrid;