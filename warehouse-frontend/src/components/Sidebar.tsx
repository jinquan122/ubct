import React from 'react';
import type { WarehouseSummary } from '../types/warehouse';
import { SLOT_DIMENSIONS } from '../types/warehouse';
import { 
  MousePointer, 
  Package, 
  Plus,
  Move3D,
  Layers,
  Grid3X3
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  summary: WarehouseSummary;
}

interface RackTool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const rackTools: RackTool[] = [
  {
    id: 'select',
    name: 'Select & Move',
    icon: 'pointer',
    description: 'Select and position racks in 3D space'
  },
  {
    id: 'add-rack',
    name: 'Add Rack',
    icon: 'package',
    description: 'Create new rack structure'
  },
  {
    id: 'expand-horizontal',
    name: 'Expand Width',
    icon: 'plus',
    description: 'Add slots horizontally to existing rack'
  },
  {
    id: 'expand-vertical',
    name: 'Add Level',
    icon: 'layers',
    description: 'Add vertical levels to existing rack'
  },
  {
    id: 'position-3d',
    name: '3D Position',
    icon: 'move3d',
    description: 'Precise 3D positioning controls'
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'pointer': return <MousePointer size={20} />;
    case 'package': return <Package size={20} />;
    case 'plus': return <Plus size={20} />;
    case 'layers': return <Layers size={20} />;
    case 'move3d': return <Move3D size={20} />;
    case 'grid': return <Grid3X3 size={20} />;
    default: return <Package size={20} />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ selectedTool, onToolSelect, summary }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Rack Layout Tools</h3>
        <div className="tool-grid">
          {rackTools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => onToolSelect(tool.id)}
              title={tool.description}
            >
              {getIcon(tool.icon)}
              <span className="tool-name">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Standard Slot Specs</h3>
        <div className="slot-specs">
          <div className="spec-item">
            <span className="spec-label">Width:</span>
            <span className="spec-value">{SLOT_DIMENSIONS.width}m</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Depth:</span>
            <span className="spec-value">{SLOT_DIMENSIONS.depth}m</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Height:</span>
            <span className="spec-value">{SLOT_DIMENSIONS.height}m</span>
          </div>
          <div className="spec-note">
            <Grid3X3 size={16} />
            <span>Fixed pallet slot dimensions</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Rack Summary</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-number">{summary.totalRacks}</span>
            <span className="stat-label">Total Racks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{summary.totalPositions}</span>
            <span className="stat-label">Pallet Slots</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">How to Use</h3>
        <div className="instructions">
          <ol>
            <li>Add new racks to start your layout</li>
            <li>Expand racks horizontally or vertically</li>
            <li>Use 3D positioning to place racks precisely</li>
            <li>Configure each rack's structure individually</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;