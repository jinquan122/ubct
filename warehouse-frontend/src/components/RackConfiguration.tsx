import React, { useState } from 'react';
import type { WarehouseElement, RackConfig } from '../types/warehouse';
import { SLOT_DIMENSIONS } from '../types/warehouse';
import { 
  X, 
  Move3D, 
  Trash2, 
  Plus, 
  Minus, 
  Grid3X3,
  Maximize2
} from 'lucide-react';
import './RackConfiguration.css';

interface RackConfigurationProps {
  element: WarehouseElement;
  config: RackConfig;
  onConfigChange: (config: RackConfig) => void;
  onClose: () => void;
  onUpdate: (updates: Partial<WarehouseElement>) => void;
  onExpand: (direction: 'width' | 'depth' | 'height', amount: number) => void;
  onDelete: () => void;
}

const RackConfiguration: React.FC<RackConfigurationProps> = ({
  element,
  config,
  onConfigChange,
  onClose,
  onUpdate,
  onExpand,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'position' | 'properties'>('structure');


  const handlePositionUpdate = (axis: 'x' | 'y' | 'z', value: number) => {
    onUpdate({ 
      position: { 
        ...element.position, 
        [axis]: value 
      }
    });
  };

  const handleRotationUpdate = (axis: 'x' | 'y' | 'z', value: number) => {
    onUpdate({ 
      rotation: { 
        ...element.rotation, 
        [axis]: value 
      }
    });
  };

  const handleExpand = (direction: 'width' | 'depth' | 'height', amount: number) => {
    onExpand(direction, amount);
  };

  const totalSlots = config.width * config.depth * config.height;
  const physicalWidth = config.width * SLOT_DIMENSIONS.width;
  const physicalDepth = config.depth * SLOT_DIMENSIONS.depth;
  const physicalHeight = config.height * SLOT_DIMENSIONS.height;

  return (
    <div className="rack-configuration">
      <div className="config-header">
        <h3>Rack Configuration</h3>
        <div className="rack-id">ID: {element.id}</div>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="config-tabs">
        <button 
          className={`tab ${activeTab === 'structure' ? 'active' : ''}`}
          onClick={() => setActiveTab('structure')}
        >
          <Grid3X3 size={16} />
          Structure
        </button>
        <button 
          className={`tab ${activeTab === 'position' ? 'active' : ''}`}
          onClick={() => setActiveTab('position')}
        >
          <Move3D size={16} />
          3D Position
        </button>
        <button 
          className={`tab ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          <Maximize2 size={16} />
          Properties
        </button>
      </div>

      <div className="config-content">
        {activeTab === 'structure' && (
          <>
            <div className="config-section">
              <h4>Rack Structure</h4>
              
              <div className="structure-controls">
                <div className="dimension-control">
                  <label>Width (slots)</label>
                  <div className="control-group">
                    <button 
                      className="expand-btn" 
                      onClick={() => handleExpand('width', -1)}
                      disabled={config.width <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="dimension-value">{config.width}</span>
                    <button 
                      className="expand-btn" 
                      onClick={() => handleExpand('width', 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="dimension-physical">{physicalWidth.toFixed(1)}m</span>
                </div>

                <div className="dimension-control">
                  <label>Depth (slots)</label>
                  <div className="control-group">
                    <button 
                      className="expand-btn" 
                      onClick={() => handleExpand('depth', -1)}
                      disabled={config.depth <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="dimension-value">{config.depth}</span>
                    <button 
                      className="expand-btn" 
                      onClick={() => handleExpand('depth', 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="dimension-physical">{physicalDepth.toFixed(1)}m</span>
                </div>

                <div className="dimension-control">
                  <label>Height (levels)</label>
                  <div className="control-group">
                    <button 
                      className="expand-btn" 
                      onClick={() => handleExpand('height', -1)}
                      disabled={config.height <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="dimension-value">{config.height}</span>
                    <button 
                      className="expand-btn" 
                      onClick={() => handleExpand('height', 1)}
                      disabled={config.height >= 8}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="dimension-physical">{physicalHeight.toFixed(1)}m</span>
                </div>
              </div>

              <div className="structure-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Slots:</span>
                  <span className="summary-value">{totalSlots}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Footprint:</span>
                  <span className="summary-value">{physicalWidth.toFixed(1)}×{physicalDepth.toFixed(1)}m</span>
                </div>
              </div>
            </div>

            <div className="config-section">
              <h4>Spacing Controls</h4>
              
              <div className="config-row">
                <label>Aisle Width (m):</label>
                <input
                  type="number"
                  step="0.1"
                  min="2.0"
                  max="5.0"
                  value={config.spacing.aisle}
                  onChange={(e) => {
                    const newSpacing = {
                      ...config.spacing,
                      aisle: parseFloat(e.target.value)
                    };
                    const newConfig = { ...config, spacing: newSpacing };
                    onConfigChange(newConfig);
                  }}
                />
              </div>

              <div className="config-row">
                <label>Level Spacing (m):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="1.0"
                  value={config.spacing.level}
                  onChange={(e) => {
                    const newSpacing = {
                      ...config.spacing,
                      level: parseFloat(e.target.value)
                    };
                    const newConfig = { ...config, spacing: newSpacing };
                    onConfigChange(newConfig);
                  }}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'position' && (
          <div className="config-section">
            <h4>3D Position Control</h4>
            
            <div className="position-controls">
              <div className="axis-control">
                <label>X Position (m)</label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={element.position.x}
                  onChange={(e) => handlePositionUpdate('x', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  step="0.1"
                  value={element.position.x.toFixed(1)}
                  onChange={(e) => handlePositionUpdate('x', parseFloat(e.target.value))}
                />
              </div>

              <div className="axis-control">
                <label>Y Position (m)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={element.position.y}
                  onChange={(e) => handlePositionUpdate('y', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  step="0.1"
                  value={element.position.y.toFixed(1)}
                  onChange={(e) => handlePositionUpdate('y', parseFloat(e.target.value))}
                />
              </div>

              <div className="axis-control">
                <label>Z Position (m)</label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.1"
                  value={element.position.z || 0}
                  onChange={(e) => handlePositionUpdate('z', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  step="0.1"
                  value={(element.position.z || 0).toFixed(1)}
                  onChange={(e) => handlePositionUpdate('z', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="rotation-controls-3d">
              <h5>Rotation</h5>
              <div className="axis-control">
                <label>X Rotation (°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={element.rotation.x || 0}
                  onChange={(e) => handleRotationUpdate('x', parseInt(e.target.value))}
                />
                <span>{element.rotation.x || 0}°</span>
              </div>

              <div className="axis-control">
                <label>Y Rotation (°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={element.rotation.y || 0}
                  onChange={(e) => handleRotationUpdate('y', parseInt(e.target.value))}
                />
                <span>{element.rotation.y || 0}°</span>
              </div>

              <div className="axis-control">
                <label>Z Rotation (°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={element.rotation.z || 0}
                  onChange={(e) => handleRotationUpdate('z', parseInt(e.target.value))}
                />
                <span>{element.rotation.z || 0}°</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="config-section">
            <h4>Rack Properties</h4>
            
            <div className="config-row">
              <label>Rack Name:</label>
              <input
                type="text"
                value={element.properties?.name || ''}
                onChange={(e) => onUpdate({ 
                  properties: { 
                    ...element.properties, 
                    name: e.target.value 
                  }
                })}
                placeholder="e.g., Rack A1"
              />
            </div>

            <div className="config-row">
              <label>Color Theme:</label>
              <select
                value={element.properties?.color || 'blue'}
                onChange={(e) => onUpdate({ 
                  properties: { 
                    ...element.properties, 
                    color: e.target.value 
                  }
                })}
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
              </select>
            </div>

            <div className="properties-summary">
              <h5>Calculated Properties</h5>
              <div className="property-item">
                <span>Weight Capacity:</span>
                <span>{(totalSlots * 1000).toLocaleString()} kg</span>
              </div>
              <div className="property-item">
                <span>Volume:</span>
                <span>{(physicalWidth * physicalDepth * physicalHeight).toFixed(1)} m³</span>
              </div>
            </div>
          </div>
        )}

        <div className="config-actions">
          <button className="action-button primary" onClick={onClose}>
            <Move3D size={16} />
            Apply Configuration
          </button>
          <button 
            className="action-button danger"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            <Trash2 size={16} />
            Delete Rack
          </button>
        </div>
      </div>
    </div>
  );
};

export default RackConfiguration;