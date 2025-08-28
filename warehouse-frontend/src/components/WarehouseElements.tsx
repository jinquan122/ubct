import React from 'react';
import type { WarehouseElement } from '../types/warehouse';

interface WarehouseElementsProps {
  elements: WarehouseElement[];
  pixelsPerMeter: number;
  onElementMouseDown: (event: React.MouseEvent, element: WarehouseElement) => void;
  draggedElementId: string | null;
}

const WarehouseElements: React.FC<WarehouseElementsProps> = ({
  elements,
  pixelsPerMeter,
  onElementMouseDown,
  draggedElementId
}) => {
  const getElementColor = (type: WarehouseElement['type']) => {
    const colors = {
      rack: '#3b82f6',
      aisle: '#f59e0b',
      conveyor: '#10b981',
      workstation: '#8b5cf6',
      dock: '#ef4444',
      office: '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getElementIcon = (type: WarehouseElement['type']) => {
    const icons = {
      rack: '📦',
      aisle: '🛣️',
      conveyor: '⚡',
      workstation: '💼',
      dock: '🚚',
      office: '🏢'
    };
    return icons[type] || '📦';
  };

  return (
    <div className="warehouse-elements">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`warehouse-element ${element.type} ${
            draggedElementId === element.id ? 'dragging' : ''
          }`}
          style={{
            position: 'absolute',
            left: element.position.x * pixelsPerMeter,
            top: element.position.y * pixelsPerMeter,
            width: (element.structure.width * 1.2) * pixelsPerMeter,
            height: (element.structure.depth * 1.0) * pixelsPerMeter,
            backgroundColor: getElementColor(element.type),
            border: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '500',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transform: `rotate(${element.rotation}deg)`,
            transition: draggedElementId === element.id ? 'none' : 'all 0.2s ease',
            zIndex: draggedElementId === element.id ? 1000 : 1,
            opacity: draggedElementId === element.id ? 0.8 : 1
          }}
          onMouseDown={(e) => onElementMouseDown(e, element)}
          title={`${element.type.charAt(0).toUpperCase() + element.type.slice(1)} - ${element.id}`}
        >
          <span className="element-icon" style={{ marginRight: '4px' }}>
            {getElementIcon(element.type)}
          </span>
          <span className="element-type">
            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
          </span>
          
          {/* Resize handles for selected elements */}
          {draggedElementId === element.id && (
            <>
              <div className="resize-handle resize-se" />
              <div className="resize-handle resize-ne" />
              <div className="resize-handle resize-sw" />
              <div className="resize-handle resize-nw" />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default WarehouseElements;