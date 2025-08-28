import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Html } from '@react-three/drei';
import Rack3D from './Rack3D';
import type { WarehouseElement } from '../types/warehouse';
import * as THREE from 'three';

interface Warehouse3DProps {
  racks: WarehouseElement[];
  selectedRack: WarehouseElement | null;
  onRackSelect: (rack: WarehouseElement) => void;
  onRackAdd?: (position: { x: number; y: number; z: number }) => void;
}

interface WarehouseFloorProps {
  width: number;
  depth: number;
  onFloorClick?: (position: { x: number; y: number; z: number }) => void;
}

const WarehouseFloor: React.FC<WarehouseFloorProps> = ({ width, depth, onFloorClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const handleClick = (event: any) => {
    if (onFloorClick && event.point) {
      onFloorClick({
        x: event.point.x,
        y: event.point.y,
        z: event.point.z
      });
    }
  };

  return (
    <group>
      {/* Main floor */}
      <mesh 
        ref={meshRef}
        position={[width/2, -0.01, depth/2]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleClick}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      
      {/* Grid overlay */}
      <Grid
        position={[width/2, 0, depth/2]}
        args={[width, depth]}
        cellSize={1}
        cellThickness={1}
        cellColor="#e2e8f0"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#cbd5e1"
        infiniteGrid={false}
        fadeDistance={50}
        fadeStrength={0.5}
      />
      
      {/* Zone markers */}
      <group>
        {/* Zone 1 */}
        <Html position={[1, 0.1, 1]}>
          <div className="zone-marker">1</div>
        </Html>
        
        {/* Zone 2 */}
        <Html position={[width-1, 0.1, 1]}>
          <div className="zone-marker">2</div>
        </Html>
        
        {/* Zone 3 */}
        <Html position={[1, 0.1, depth-1]}>
          <div className="zone-marker">3</div>
        </Html>
        
        {/* Zone 4 */}
        <Html position={[width-1, 0.1, depth-1]}>
          <div className="zone-marker">4</div>
        </Html>
      </group>

      {/* Warehouse boundaries */}
      <group>
        {/* Walls */}
        <mesh position={[width/2, 2, -0.1]}>
          <boxGeometry args={[width, 4, 0.2]} />
          <meshStandardMaterial color="#6b7280" transparent opacity={0.3} />
        </mesh>
        <mesh position={[width/2, 2, depth + 0.1]}>
          <boxGeometry args={[width, 4, 0.2]} />
          <meshStandardMaterial color="#6b7280" transparent opacity={0.3} />
        </mesh>
        <mesh position={[-0.1, 2, depth/2]}>
          <boxGeometry args={[0.2, 4, depth]} />
          <meshStandardMaterial color="#6b7280" transparent opacity={0.3} />
        </mesh>
        <mesh position={[width + 0.1, 2, depth/2]}>
          <boxGeometry args={[0.2, 4, depth]} />
          <meshStandardMaterial color="#6b7280" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
};

const CameraController: React.FC = () => {
  const { camera } = useThree();
  
  React.useEffect(() => {
    // Set initial camera position for good warehouse overview
    camera.position.set(10, 8, 12);
    camera.lookAt(7.5, 0, 5);
  }, [camera]);

  return null;
};

const Warehouse3D: React.FC<Warehouse3DProps> = ({ 
  racks, 
  selectedRack, 
  onRackSelect,
  onRackAdd 
}) => {
  const warehouseWidth = 15;
  const warehouseDepth = 10;

  const handleFloorClick = (position: { x: number; y: number; z: number }) => {
    if (onRackAdd) {
      onRackAdd({
        x: position.x,
        y: 0,
        z: position.z
      });
    }
  };

  return (
    <div className="warehouse-3d-container">
      <Canvas
        shadows
        camera={{ 
          position: [10, 8, 12], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#f8fafc' }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[7.5, 10, 5]} intensity={0.5} />

        {/* Environment */}
        <Environment preset="warehouse" />
        
        {/* Camera controls */}
        <CameraController />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0.1}
        />

        {/* Warehouse floor and structure */}
        <WarehouseFloor 
          width={warehouseWidth} 
          depth={warehouseDepth}
          onFloorClick={handleFloorClick}
        />

        {/* Render all racks */}
        {racks.map((rack) => (
          <Rack3D
            key={rack.id}
            rack={rack}
            isSelected={selectedRack?.id === rack.id}
            onSelect={() => onRackSelect(rack)}
          />
        ))}
      </Canvas>

      {/* 3D Controls overlay */}
      <div className="warehouse-3d-controls">
        <div className="control-info">
          <h4>3D Controls</h4>
          <ul>
            <li><strong>Rotate:</strong> Left click + drag</li>
            <li><strong>Pan:</strong> Right click + drag</li>
            <li><strong>Zoom:</strong> Mouse wheel</li>
            <li><strong>Select:</strong> Click on rack</li>
            <li><strong>Add Rack:</strong> Click on floor</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Warehouse3D;