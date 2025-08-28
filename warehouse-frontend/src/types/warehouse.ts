export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

// Fixed slot dimensions (standard pallet size)
export const SLOT_DIMENSIONS = {
  width: 1.2, // meters
  depth: 1.0, // meters
  height: 2.0 // meters (clearance per level)
} as const;

export interface RackSlot {
  id: string;
  position: Position3D;
  occupied: boolean;
  palletId?: string;
}

export interface RackStructure {
  id: string;
  position: Position3D;
  rotation: { x: number; y: number; z: number };
  structure: {
    width: number; // number of bays horizontally
    depth: number; // number of bays depth-wise
    height: number; // number of levels vertically
  };
  slots: RackSlot[];
  properties?: {
    name?: string;
    color?: string;
    [key: string]: any;
  };
}

export interface WarehouseElement extends RackStructure {
  type: 'rack';
}

export interface RackConfig {
  width: number; // number of slots wide
  depth: number; // number of slots deep  
  height: number; // number of levels high
  spacing: {
    aisle: number; // aisle width between racks
    level: number; // vertical spacing between levels
  };
}

export interface WarehouseSummary {
  totalRacks: number;
  totalPositions: number;
}

export interface WarehouseData {
  elements: WarehouseElement[];
  dimensions: Dimensions;
  zones: number;
  summary: WarehouseSummary;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (elements: WarehouseElement[]) => ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface DesignTool {
  id: string;
  name: string;
  icon: string;
  type: WarehouseElement['type'];
  defaultDimensions: Dimensions;
}