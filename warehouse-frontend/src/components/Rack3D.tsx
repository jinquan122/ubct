import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import type { WarehouseElement } from '../types/warehouse';
import { SLOT_DIMENSIONS } from '../types/warehouse';
import * as THREE from 'three';

interface Rack3DProps {
  rack: WarehouseElement;
  isSelected: boolean;
  onSelect: () => void;
}

interface SlotProps {
  position: [number, number, number];
  isOccupied: boolean;
  slotId: string;
}

const Slot: React.FC<SlotProps> = ({ position, isOccupied }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate hover effect
  useFrame((state) => {
    if (meshRef.current) {
      const hoverScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      if (isOccupied) {
        meshRef.current.scale.setScalar(hoverScale);
      }
    }
  });

  return (
    <group position={position}>
      {/* Slot frame structure */}
      <Box 
        ref={meshRef}
        args={[SLOT_DIMENSIONS.width, SLOT_DIMENSIONS.height, SLOT_DIMENSIONS.depth]}
        position={[0, SLOT_DIMENSIONS.height / 2, 0]}
      >
        <meshStandardMaterial 
          color={isOccupied ? '#f59e0b' : '#e5e7eb'} 
          transparent 
          opacity={isOccupied ? 0.8 : 0.3}
          wireframe={!isOccupied}
        />
      </Box>
      
      {/* Floor plate */}
      <Box 
        args={[SLOT_DIMENSIONS.width, 0.05, SLOT_DIMENSIONS.depth]}
        position={[0, 0.025, 0]}
      >
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      {/* Support beams */}
      <Box 
        args={[0.08, SLOT_DIMENSIONS.height, 0.08]}
        position={[-SLOT_DIMENSIONS.width/2 + 0.04, SLOT_DIMENSIONS.height/2, -SLOT_DIMENSIONS.depth/2 + 0.04]}
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box 
        args={[0.08, SLOT_DIMENSIONS.height, 0.08]}
        position={[SLOT_DIMENSIONS.width/2 - 0.04, SLOT_DIMENSIONS.height/2, -SLOT_DIMENSIONS.depth/2 + 0.04]}
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box 
        args={[0.08, SLOT_DIMENSIONS.height, 0.08]}
        position={[-SLOT_DIMENSIONS.width/2 + 0.04, SLOT_DIMENSIONS.height/2, SLOT_DIMENSIONS.depth/2 - 0.04]}
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box 
        args={[0.08, SLOT_DIMENSIONS.height, 0.08]}
        position={[SLOT_DIMENSIONS.width/2 - 0.04, SLOT_DIMENSIONS.height/2, SLOT_DIMENSIONS.depth/2 - 0.04]}
      >
        <meshStandardMaterial color="#374151" />
      </Box>

      {/* Pallet if occupied */}
      {isOccupied && (
        <Box 
          args={[SLOT_DIMENSIONS.width * 0.9, 0.15, SLOT_DIMENSIONS.depth * 0.9]}
          position={[0, 0.15, 0]}
        >
          <meshStandardMaterial color="#92400e" />
        </Box>
      )}
    </group>
  );
};

const Rack3D: React.FC<Rack3DProps> = ({ rack, isSelected, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  useThree();
  
  // Calculate rack dimensions
  const rackWidth = rack.structure.width * SLOT_DIMENSIONS.width;
  const rackHeight = rack.structure.height * SLOT_DIMENSIONS.height;
  const rackDepth = rack.structure.depth * SLOT_DIMENSIONS.depth;

  // Generate slot positions
  const slots = useMemo(() => {
    const slotPositions: Array<{position: [number, number, number], isOccupied: boolean, id: string}> = [];
    
    for (let x = 0; x < rack.structure.width; x++) {
      for (let z = 0; z < rack.structure.depth; z++) {
        for (let y = 0; y < rack.structure.height; y++) {
          const posX = (x - (rack.structure.width - 1) / 2) * SLOT_DIMENSIONS.width;
          const posY = y * SLOT_DIMENSIONS.height;
          const posZ = (z - (rack.structure.depth - 1) / 2) * SLOT_DIMENSIONS.depth;
          
          // Check if slot is occupied (random for demo)
          const isOccupied = Math.random() > 0.7;
          
          slotPositions.push({
            position: [posX, posY, posZ],
            isOccupied,
            id: `${x}-${y}-${z}`
          });
        }
      }
    }
    
    return slotPositions;
  }, [rack.structure]);

  // Handle click to select rack
  const handleClick = (event: any) => {
    event.stopPropagation();
    onSelect();
  };

  // Animate selection highlight
  useFrame((state) => {
    if (groupRef.current && isSelected) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      groupRef.current.scale.setScalar(pulse);
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
    }
  });

  return (
    <group 
      ref={groupRef}
      position={[rack.position.x, rack.position.z, rack.position.y]}
      rotation={[
        rack.rotation.x * Math.PI / 180,
        rack.rotation.y * Math.PI / 180, 
        rack.rotation.z * Math.PI / 180
      ]}
      onClick={handleClick}
    >
      {/* Render all slots */}
      {slots.map((slot, index) => (
        <Slot
          key={`${rack.id}-slot-${index}`}
          position={slot.position}
          isOccupied={slot.isOccupied}
          slotId={slot.id}
        />
      ))}
      
      {/* Base platform */}
      <Box 
        args={[rackWidth + 0.2, 0.1, rackDepth + 0.2]}
        position={[0, -0.05, 0]}
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      
      {/* Rack identification */}
      <Text
        position={[0, rackHeight + 0.5, -rackDepth/2 - 0.3]}
        fontSize={0.3}
        color={isSelected ? '#3b82f6' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {rack.properties?.name || rack.id}
      </Text>

      {/* Selection outline */}
      {isSelected && (
        <Box 
          args={[rackWidth + 0.4, rackHeight + 0.2, rackDepth + 0.4]}
          position={[0, rackHeight/2, 0]}
        >
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.2} 
            wireframe 
          />
        </Box>
      )}
    </group>
  );
};

export default Rack3D;