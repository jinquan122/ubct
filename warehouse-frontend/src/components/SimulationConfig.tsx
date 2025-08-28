import React, { useState } from 'react';
import type { WarehouseData } from '../types/warehouse';
import { ArrowLeft, Play, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import './SimulationConfig.css';

interface SimulationConfigProps {
  warehouseData: WarehouseData;
  onBack: () => void;
}

interface SimulationSettings {
  simulationSpeed: number;
  maxVehicles: number;
  vehicleType: 'forklift' | 'agv' | 'both';
  operationMode: 'inbound' | 'outbound' | 'mixed';
  workingHours: number;
  safetyMargins: boolean;
  realTimeUpdates: boolean;
}

const SimulationConfig: React.FC<SimulationConfigProps> = ({ warehouseData, onBack }) => {
  const [settings, setSettings] = useState<SimulationSettings>({
    simulationSpeed: 1.0,
    maxVehicles: 3,
    vehicleType: 'forklift',
    operationMode: 'mixed',
    workingHours: 8,
    safetyMargins: true,
    realTimeUpdates: true
  });

  const [validationResults, setValidationResults] = useState<{
    warnings: string[];
    errors: string[];
    isValid: boolean;
  }>({
    warnings: [],
    errors: [],
    isValid: true
  });

  React.useEffect(() => {
    validateWarehouseLayout();
  }, [warehouseData]);

  const validateWarehouseLayout = () => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // All elements are now racks in the new system
    const racks = warehouseData.elements.filter(el => el.type === 'rack');

    // Check for minimum spacing between racks
    if (racks.length > 1) {
      // Check spacing between racks
      for (let i = 0; i < racks.length - 1; i++) {
        for (let j = i + 1; j < racks.length; j++) {
          const rack1 = racks[i];
          const rack2 = racks[j];
          const distance = Math.sqrt(
            Math.pow(rack2.position.x - rack1.position.x, 2) +
            Math.pow(rack2.position.y - rack1.position.y, 2)
          );
          
          const minDistance = 3.0; // 3m minimum aisle width
          if (distance < minDistance) {
            warnings.push(`Racks ${rack1.id} and ${rack2.id} may be too close (${distance.toFixed(1)}m). Minimum recommended: ${minDistance}m.`);
          }
        }
      }
    }

    if (racks.length === 0) {
      errors.push('No racks configured. Add racks to simulate warehouse operations.');
    }

    // Check rack structure validity
    racks.forEach(rack => {
      if (rack.structure.height > 6) {
        warnings.push(`Rack ${rack.id} is very tall (${rack.structure.height} levels). Consider forklift height limitations.`);
      }
      if (rack.structure.width > 10 || rack.structure.depth > 10) {
        warnings.push(`Rack ${rack.id} is very large. Consider access and maintenance requirements.`);
      }
    });

    // Note about loading access
    if (racks.length > 0) {
      warnings.push('Remember to plan for loading dock access and material flow paths in your actual warehouse.');
    }

    // Check warehouse utilization
    const totalRackArea = racks.reduce((sum, rack) => 
      sum + (rack.structure.width * 1.2 * rack.structure.depth * 1.0), 0
    );
    const warehouseArea = warehouseData.dimensions.width * warehouseData.dimensions.height;
    const utilization = (totalRackArea / warehouseArea) * 100;

    if (utilization > 75) {
      warnings.push(`High warehouse utilization (${utilization.toFixed(1)}%). May impact vehicle movement efficiency.`);
    }

    setValidationResults({
      warnings,
      errors,
      isValid: errors.length === 0
    });
  };

  const handleSettingChange = <K extends keyof SimulationSettings>(
    key: K,
    value: SimulationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleStartSimulation = () => {
    if (!validationResults.isValid) {
      alert('Please fix validation errors before starting simulation.');
      return;
    }

    // In a real app, this would start the simulation
    alert('Simulation would start with current configuration. This is a demo interface.');
  };

  const generateBlueprint = () => {
    // In a real app, this would generate a downloadable blueprint
    alert('Blueprint generation feature would export the layout as PDF/DWG format.');
  };

  return (
    <div className="simulation-config">
      <div className="config-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Designer
        </button>
        <h1>Configure Simulation</h1>
      </div>

      <div className="config-layout">
        <div className="config-main">
          <div className="config-section">
            <h2>Simulation Parameters</h2>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label>Simulation Speed:</label>
                <select
                  value={settings.simulationSpeed}
                  onChange={(e) => handleSettingChange('simulationSpeed', parseFloat(e.target.value))}
                >
                  <option value={0.5}>0.5x (Slow)</option>
                  <option value={1.0}>1.0x (Normal)</option>
                  <option value={2.0}>2.0x (Fast)</option>
                  <option value={5.0}>5.0x (Very Fast)</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Max Vehicles:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxVehicles}
                  onChange={(e) => handleSettingChange('maxVehicles', parseInt(e.target.value))}
                />
              </div>

              <div className="setting-item">
                <label>Vehicle Type:</label>
                <select
                  value={settings.vehicleType}
                  onChange={(e) => handleSettingChange('vehicleType', e.target.value as any)}
                >
                  <option value="forklift">Forklift Only</option>
                  <option value="agv">AGV Only</option>
                  <option value="both">Mixed Fleet</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Operation Mode:</label>
                <select
                  value={settings.operationMode}
                  onChange={(e) => handleSettingChange('operationMode', e.target.value as any)}
                >
                  <option value="inbound">Inbound Only</option>
                  <option value="outbound">Outbound Only</option>
                  <option value="mixed">Mixed Operations</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Working Hours:</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={settings.workingHours}
                  onChange={(e) => handleSettingChange('workingHours', parseInt(e.target.value))}
                />
              </div>

              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.safetyMargins}
                    onChange={(e) => handleSettingChange('safetyMargins', e.target.checked)}
                  />
                  Enable Safety Margins
                </label>
              </div>

              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.realTimeUpdates}
                    onChange={(e) => handleSettingChange('realTimeUpdates', e.target.checked)}
                  />
                  Real-time Updates
                </label>
              </div>
            </div>
          </div>

          <div className="config-section">
            <h2>Layout Validation</h2>
            
            <div className="validation-panel">
              {validationResults.errors.length > 0 && (
                <div className="validation-group errors">
                  <div className="validation-header">
                    <AlertTriangle size={20} className="error-icon" />
                    <span>Errors ({validationResults.errors.length})</span>
                  </div>
                  <ul>
                    {validationResults.errors.map((error, index) => (
                      <li key={index} className="error-item">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResults.warnings.length > 0 && (
                <div className="validation-group warnings">
                  <div className="validation-header">
                    <AlertTriangle size={20} className="warning-icon" />
                    <span>Warnings ({validationResults.warnings.length})</span>
                  </div>
                  <ul>
                    {validationResults.warnings.map((warning, index) => (
                      <li key={index} className="warning-item">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResults.isValid && validationResults.warnings.length === 0 && (
                <div className="validation-group success">
                  <div className="validation-header">
                    <CheckCircle size={20} className="success-icon" />
                    <span>Layout Validation Passed</span>
                  </div>
                  <p>Your warehouse layout meets all requirements for simulation.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="config-sidebar">
          <div className="layout-summary">
            <h3>Layout Summary</h3>
            
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">{warehouseData.elements.length}</span>
                <span className="stat-label">Total Elements</span>
              </div>
              <div className="stat">
                <span className="stat-value">{warehouseData.summary.totalRacks}</span>
                <span className="stat-label">Racks</span>
              </div>
              <div className="stat">
                <span className="stat-value">{warehouseData.summary.totalPositions}</span>
                <span className="stat-label">Positions</span>
              </div>
            </div>

            <div className="element-breakdown">
              <h4>Element Breakdown</h4>
              {['rack', 'aisle', 'conveyor', 'workstation', 'dock', 'office'].map(type => {
                const count = warehouseData.elements.filter(el => el.type === type).length;
                return count > 0 ? (
                  <div key={type} className="element-count">
                    <span className="element-type">{type.charAt(0).toUpperCase() + type.slice(1)}s:</span>
                    <span className="element-number">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={handleStartSimulation}
              disabled={!validationResults.isValid}
            >
              <Play size={20} />
              Start Simulation
            </button>
            
            <button className="secondary-button" onClick={generateBlueprint}>
              <Settings size={20} />
              Generate Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationConfig;