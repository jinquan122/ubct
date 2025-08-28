import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import WarehouseCanvas from './WarehouseCanvas';
import RackConfiguration from './RackConfiguration';
import SimulationConfig from './SimulationConfig';
import type { WarehouseElement, RackConfig, WarehouseData } from '../types/warehouse';
import { SLOT_DIMENSIONS } from '../types/warehouse';
import './LayoutDesigner.css';

const LayoutDesigner: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [racks, setRacks] = useState<WarehouseElement[]>([]);
  const [selectedRack, setSelectedRack] = useState<WarehouseElement | null>(null);
  const [defaultRackConfig, setDefaultRackConfig] = useState<RackConfig>({
    width: 3,  // slots wide
    depth: 2,  // slots deep
    height: 4, // levels high
    spacing: {
      aisle: 3.0,  // meters
      level: 0.3   // meters
    }
  });
  const [showSimulationConfig, setShowSimulationConfig] = useState(false);

  const generateRackId = useCallback(() => {
    const rackNumber = racks.length + 1;
    return `rack-${rackNumber.toString().padStart(3, '0')}`;
  }, [racks.length]);

  const createRackSlots = useCallback((config: RackConfig): any[] => {
    const slots = [];
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.depth; y++) {
        for (let z = 0; z < config.height; z++) {
          slots.push({
            id: `slot-${x}-${y}-${z}`,
            position: { 
              x: x * SLOT_DIMENSIONS.width, 
              y: y * SLOT_DIMENSIONS.depth, 
              z: z * SLOT_DIMENSIONS.height 
            },
            occupied: false,
            palletId: null
          });
        }
      }
    }
    return slots;
  }, []);

  const handleRackAdd = useCallback(() => {
    const newRack: WarehouseElement = {
      id: generateRackId(),
      type: 'rack',
      position: { x: 2, y: 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      structure: {
        width: defaultRackConfig.width,
        depth: defaultRackConfig.depth,
        height: defaultRackConfig.height
      },
      slots: createRackSlots(defaultRackConfig),
      properties: {
        name: `Rack ${racks.length + 1}`,
        color: 'blue'
      }
    };
    setRacks(prev => [...prev, newRack]);
  }, [generateRackId, defaultRackConfig, createRackSlots, racks.length]);

  const handleRackUpdate = useCallback((rackId: string, updates: Partial<WarehouseElement>) => {
    setRacks(prev => 
      prev.map(rack => rack.id === rackId ? { ...rack, ...updates } : rack)
    );
  }, []);

  const handleRackDelete = useCallback((rackId: string) => {
    setRacks(prev => prev.filter(rack => rack.id !== rackId));
    if (selectedRack?.id === rackId) {
      setSelectedRack(null);
    }
  }, [selectedRack]);

  const handleRackExpand = useCallback((rackId: string, direction: 'width' | 'depth' | 'height', amount: number) => {
    setRacks(prev => prev.map(rack => {
      if (rack.id === rackId) {
        const newStructure = { 
          ...rack.structure, 
          [direction]: Math.max(1, rack.structure[direction] + amount)
        };
        
        const config: RackConfig = {
          width: newStructure.width,
          depth: newStructure.depth,
          height: newStructure.height,
          spacing: defaultRackConfig.spacing
        };

        return {
          ...rack,
          structure: newStructure,
          slots: createRackSlots(config)
        };
      }
      return rack;
    }));
  }, [defaultRackConfig.spacing, createRackSlots]);

  const calculateSummary = useCallback(() => {
    const totalRacks = racks.length;
    const totalPositions = racks.reduce((sum, rack) => 
      sum + (rack.structure.width * rack.structure.depth * rack.structure.height), 0
    );
    
    return {
      totalRacks,
      totalPositions
    };
  }, [racks]);

  const handleToolAction = useCallback((toolId: string) => {
    switch (toolId) {
      case 'add-rack':
        handleRackAdd();
        break;
      case 'expand-horizontal':
        if (selectedRack) {
          handleRackExpand(selectedRack.id, 'width', 1);
        }
        break;
      case 'expand-vertical':
        if (selectedRack) {
          handleRackExpand(selectedRack.id, 'height', 1);
        }
        break;
      default:
        setSelectedTool(toolId);
    }
  }, [selectedRack, handleRackAdd, handleRackExpand]);

  const warehouseData: WarehouseData = {
    elements: racks,
    dimensions: { width: 15, height: 10 },
    zones: 4,
    summary: calculateSummary()
  };

  if (showSimulationConfig) {
    return (
      <SimulationConfig 
        warehouseData={warehouseData}
        onBack={() => setShowSimulationConfig(false)}
      />
    );
  }

  return (
    <div className="layout-designer">
      <div className="designer-content">
        <Sidebar
          selectedTool={selectedTool}
          onToolSelect={handleToolAction}
          summary={calculateSummary()}
        />
        
        <div className="canvas-container">
          <WarehouseCanvas
            selectedTool={selectedTool}
            elements={racks}
            onElementAdd={handleRackAdd}
            onElementSelect={setSelectedRack}
            onElementUpdate={handleRackUpdate}
            onElementDelete={handleRackDelete}
          />
        </div>

        {selectedRack && (
          <RackConfiguration
            element={selectedRack}
            config={defaultRackConfig}
            onConfigChange={setDefaultRackConfig}
            onClose={() => setSelectedRack(null)}
            onUpdate={(updates) => handleRackUpdate(selectedRack.id, updates)}
            onExpand={(direction, amount) => handleRackExpand(selectedRack.id, direction, amount)}
            onDelete={() => handleRackDelete(selectedRack.id)}
          />
        )}
      </div>

      <div className="designer-footer">
        <button 
          className="simulation-button"
          onClick={() => setShowSimulationConfig(true)}
          disabled={racks.length === 0}
        >
          <span className="icon">⚙</span>
          Configure Simulation
        </button>
      </div>
    </div>
  );
};

export default LayoutDesigner;