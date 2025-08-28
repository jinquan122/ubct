import React, { useState, useRef, useCallback } from 'react';
import type { WarehouseElement } from '../types/warehouse';
import WarehouseGrid from './WarehouseGrid';
import WarehouseElements from './WarehouseElements';
import './WarehouseCanvas.css';

interface WarehouseCanvasProps {
  selectedTool: string;
  elements: WarehouseElement[];
  onElementAdd: (element: WarehouseElement) => void;
  onElementSelect: (element: WarehouseElement | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<WarehouseElement>) => void;
  onElementDelete: (elementId: string) => void;
}

const WAREHOUSE_WIDTH = 15; // meters
const WAREHOUSE_HEIGHT = 10; // meters
const CANVAS_WIDTH = 750; // pixels
const CANVAS_HEIGHT = 500; // pixels
const PIXELS_PER_METER = CANVAS_WIDTH / WAREHOUSE_WIDTH;

const WarehouseCanvas: React.FC<WarehouseCanvasProps> = ({
  selectedTool,
  elements,
  onElementAdd,
  onElementSelect,
  onElementUpdate,
  onElementDelete
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const convertCanvasToWarehouse = useCallback((canvasPos: { x: number, y: number }) => {
    return {
      x: canvasPos.x / PIXELS_PER_METER,
      y: canvasPos.y / PIXELS_PER_METER,
      z: 0
    };
  }, []);

  const convertWarehouseToCanvas = useCallback((warehousePos: { x: number, y: number }) => {
    return {
      x: warehousePos.x * PIXELS_PER_METER,
      y: warehousePos.y * PIXELS_PER_METER
    };
  }, []);

  const snapToGrid = useCallback((position: { x: number, y: number }, gridSize = 0.5) => {
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
      z: 0
    };
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'select' || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    const warehousePos = convertCanvasToWarehouse(canvasPos);
    const snappedPos = snapToGrid(warehousePos);

    // Ensure element is within bounds
    const defaultWidth = 3 * 1.2; // 3 slots * 1.2m
    const defaultDepth = 2 * 1.0; // 2 slots * 1.0m
    if (snappedPos.x + defaultWidth > WAREHOUSE_WIDTH || 
        snappedPos.y + defaultDepth > WAREHOUSE_HEIGHT) {
      return;
    }

    const newElement: WarehouseElement = {
      id: `${selectedTool}-${Date.now()}`,
      type: selectedTool as WarehouseElement['type'],
      position: snappedPos,
      rotation: { x: 0, y: 0, z: 0 },
      structure: {
        width: 3,
        depth: 2,
        height: 4
      },
      slots: [],
      properties: {}
    };

    onElementAdd(newElement);
  }, [selectedTool, convertCanvasToWarehouse, snapToGrid, onElementAdd]);

  const handleElementMouseDown = useCallback((event: React.MouseEvent, element: WarehouseElement) => {
    event.stopPropagation();
    
    if (selectedTool === 'select') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const canvasPos = convertWarehouseToCanvas(element.position);
      const mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      setDraggedElement(element.id);
      setDragOffset({
        x: mousePos.x - canvasPos.x,
        y: mousePos.y - canvasPos.y
      });
      onElementSelect(element);
    }
  }, [selectedTool, convertWarehouseToCanvas, onElementSelect]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mousePos = {
      x: event.clientX - rect.left - dragOffset.x,
      y: event.clientY - rect.top - dragOffset.y
    };

    const warehousePos = convertCanvasToWarehouse(mousePos);
    const snappedPos = snapToGrid(warehousePos);

    // Ensure element stays within bounds
    const element = elements.find(el => el.id === draggedElement);
    if (element) {
      const physicalWidth = element.structure.width * 1.2;
      const physicalHeight = element.structure.depth * 1.0;
      const maxX = WAREHOUSE_WIDTH - physicalWidth;
      const maxY = WAREHOUSE_HEIGHT - physicalHeight;
      
      snappedPos.x = Math.max(0, Math.min(maxX, snappedPos.x));
      snappedPos.y = Math.max(0, Math.min(maxY, snappedPos.y));
      snappedPos.z = element.position.z;

      onElementUpdate(draggedElement, { position: { x: snappedPos.x, y: snappedPos.y, z: snappedPos.z } });
    }
  }, [draggedElement, dragOffset, convertCanvasToWarehouse, snapToGrid, elements, onElementUpdate]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const selectedElement = elements.find(el => el.id === draggedElement);
      if (selectedElement) {
        onElementDelete(selectedElement.id);
        onElementSelect(null);
      }
    }
  }, [draggedElement, elements, onElementDelete, onElementSelect]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="warehouse-canvas-container">
      <div className="canvas-header">
        <h2>Warehouse Layout Designer</h2>
        <div className="canvas-info">
          <span>15m × 10m warehouse | Grid: 0.5m</span>
          <span className={`tool-indicator ${selectedTool}`}>
            Tool: {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}
          </span>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="warehouse-canvas"
        style={{ 
          width: CANVAS_WIDTH, 
          height: CANVAS_HEIGHT,
          cursor: selectedTool === 'select' ? 'default' : 'crosshair'
        }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <WarehouseGrid 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          gridSize={PIXELS_PER_METER * 0.5}
        />
        
        <WarehouseElements
          elements={elements}
          pixelsPerMeter={PIXELS_PER_METER}
          onElementMouseDown={handleElementMouseDown}
          draggedElementId={draggedElement}
        />

        {/* Zone Labels */}
        <div className="zone-labels">
          <div className="zone-label zone-1">1</div>
          <div className="zone-label zone-2">2</div>
          <div className="zone-label zone-3">3</div>
          <div className="zone-label zone-4">4</div>
        </div>
      </div>

      <div className="canvas-footer">
        <div className="canvas-controls">
          <button 
            className="control-button"
            onClick={() => onElementSelect(null)}
          >
            Clear Selection
          </button>
          <span className="element-count">
            Elements: {elements.length}
          </span>
        </div>
      </div>
    </div>
  );
};


export default WarehouseCanvas;