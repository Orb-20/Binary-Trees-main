// src/components/StoryTreeAnimation.jsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { DIALOGUE } from '../stories/dialogue';

// --- (treeData remains the same) ---
const treeData = {
  GENERAL: {
    nodes: [ { id: 1, label: 'CEO', position: [0, 2, 0] }, { id: 2, label: 'Manager', position: [-3, 0, 0] }, { id: 3, label: 'Manager', position: [0, 0, 0] }, { id: 4, label: 'Manager', position: [3, 0, 0] }, { id: 5, label: 'Team', position: [-4, -2, 0] }, { id: 6, label: 'Team', position: [-2, -2, 0] }, { id: 7, label: 'Team', position: [3, -2, 0] }, ],
    links: [ { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 1, end: 4 }, { start: 2, end: 5 }, { start: 2, end: 6 }, { start: 4, end: 7 }, ],
  },
  BT: {
    nodes: [ { id: 1, label: 'CEO', position: [0, 2, 0] }, { id: 2, label: 'Manager', position: [-2, 0, 0] }, { id: 3, label: 'Manager', position: [2, 0, 0] }, { id: 4, label: 'Team', position: [-3, -2, 0] }, { id: 5, label: 'Team', position: [-1, -2, 0] }, ],
    links: [ { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 2, end: 4 }, { start: 2, end: 5 }, ],
  },
  BST: {
    nodes: [ { id: 1, label: 'CEO', value: 50, position: [0, 2.5, 0] }, { id: 2, label: 'Manager', value: 30, position: [-2.5, 0.5, 0] }, { id: 3, label: 'Manager', value: 70, position: [2.5, 0.5, 0] }, { id: 4, label: 'Team', value: 20, position: [-4, -1.5, 0] }, { id: 5, label: 'Team', value: 40, position: [-1, -1.5, 0] }, { id: 6, label: 'Team', value: 80, position: [4, -1.5, 0] }, ],
    links: [ { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 2, end: 4 }, { start: 2, end: 5 }, { start: 3, end: 6 }, ],
  },
  HEAP: {
     nodes: [ { id: 1, label: 'CEO', value: 100, position: [0, 2.5, 0] }, { id: 2, label: 'Manager', value: 80, position: [-2.5, 0.5, 0] }, { id: 3, label: 'Manager', value: 90, position: [2.5, 0.5, 0] }, { id: 4, label: 'Team', value: 40, position: [-4, -1.5, 0] }, { id: 5, label: 'Team', value: 60, position: [-1, -1.5, 0] }, { id: 6, label: 'Team', value: 70, position: [4, -1.5, 0] }, ],
     links: [ { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 2, end: 4 }, { start: 2, end: 5 }, { start: 3, end: 6 }, ],
  },
  TRIES: {
    nodes: [ { id: 1, label: '', position: [0, 2.5, 0] }, { id: 2, label: 'C', position: [0, 1, 0] }, { id: 3, label: 'A', position: [0, -0.5, 0] }, { id: 4, label: 'T', position: [-1.5, -2, 0] }, { id: 5, label: 'R', position: [1.5, -2, 0] }, ],
    links: [ { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 4 }, { start: 3, end: 5 }, ],
  },
  DEFAULT: {
    nodes: [{ id: 1, label: 'Node', position: [0, 0, 0] }],
    links: [],
  },
};

const Node = ({ node, isHighlighted }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const originalColor = useMemo(() => new THREE.Color("#032F2F"), []);
  const highlightColor = useMemo(() => new THREE.Color("#F6C85F"), []);

  useFrame(() => {
    if (!meshRef.current || !groupRef.current) return;
    const material = meshRef.current.material;
    
    // Animate scale for entry
    const targetScale = 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    
    // Animate color and emissive for highlight
    material.color.lerp(isHighlighted ? highlightColor : originalColor, 0.1);
    material.emissive.lerp(isHighlighted ? highlightColor : originalColor, 0.1);
    material.emissiveIntensity = isHighlighted ? 1.5 : 0;
  });

  return (
    <group ref={groupRef} position={node.position} scale={[0,0,0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={originalColor} roughness={0.5} metalness={0.5} emissive={originalColor} />
      </mesh>
      <Text position={[0, 0.8, 0]} fontSize={0.3} color="#0B0F13" anchorX="center" anchorY="middle">{node.label}</Text>
      {node.value !== undefined && <Text position={[0, -0.7, 0]} fontSize={0.4} color="#0B0F13" anchorX="center" anchorY="middle" fontWeight="bold">{node.value.toString()}</Text>}
    </group>
  );
};

function SceneAnimator({ type, animationFocus, currentIndex }) {
  const { camera, controls } = useThree();
  const data = useMemo(() => treeData[type] || treeData.DEFAULT, [type]);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState(new Set());

  const { visibleNodes, visibleLinks } = useMemo(() => {
      const dialogue = DIALOGUE[type]?.[currentIndex];
      if (!dialogue) return { visibleNodes: [], visibleLinks: [] };
      return {
          visibleNodes: data.nodes.filter(n => dialogue.visibleNodeIds?.includes(n.id)),
          visibleLinks: data.links.filter((l, i) => dialogue.visibleLinkIndices?.includes(i))
      }
  }, [type, currentIndex, data]);
  
  const defaultCamPos = useMemo(() => new THREE.Vector3(0, 0, 10), []);
  const defaultTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  
  const targetCamPos = useRef(defaultCamPos.clone());
  const targetControlsTarget = useRef(defaultTarget.clone());

  useEffect(() => {
    let newHighlightedIds = new Set();
    let targetNodes = [];

    if (animationFocus?.type === 'node') {
        targetNodes = data.nodes.filter(n => 
            (animationFocus.label && n.label === animationFocus.label) ||
            (animationFocus.value && n.value === animationFocus.value)
        );
    }

    if (targetNodes.length > 0) {
        newHighlightedIds = new Set(targetNodes.map(n => n.id));
        
        const center = new THREE.Vector3();
        targetNodes.forEach(n => center.add(new THREE.Vector3(...n.position)));
        center.divideScalar(targetNodes.length);
        
        targetControlsTarget.current.copy(center);
        targetCamPos.current.copy(center).add(new THREE.Vector3(0, 1, 5));
    } else {
        targetCamPos.current.copy(defaultCamPos);
        targetControlsTarget.current.copy(defaultTarget);
    }
    
    setHighlightedNodeIds(newHighlightedIds);

  }, [animationFocus, data, defaultCamPos, defaultTarget]);

  useFrame(() => {
    camera.position.lerp(targetCamPos.current, 0.05);
    if (controls) {
      controls.target.lerp(targetControlsTarget.current, 0.05);
      controls.update();
    }
  });

  return (
    <>
      {visibleNodes.map(node => <Node key={node.id} node={node} isHighlighted={highlightedNodeIds.has(node.id)} />)}
      {visibleLinks.map((link, index) => (
          <Line key={index} points={[data.nodes.find(n => n.id === link.start).position, data.nodes.find(n => n.id === link.end).position]} color="#C6A15B" lineWidth={3} />
      ))}
    </>
  );
}

export default function StoryTreeAnimation({ treeType, animationFocus, currentIndex }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <SceneAnimator type={treeType} animationFocus={animationFocus} currentIndex={currentIndex} />
      <OrbitControls makeDefault enableZoom={true} enablePan={true} />
    </Canvas>
  );
}