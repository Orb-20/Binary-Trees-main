import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// --- CONFIGURATION ---
const yPositionOffset = -1.0;
const particlesPerNode = 80;
const particlesPerLink = 45;
const nodeRadius = 0.22;

// --- PARTICLE TARGET GENERATION ---
function createParticleTargets(nodeCenters) {
  const nodeTargets = [];
  const linkTargets = [];

  nodeCenters.forEach(center => {
    const samples = particlesPerNode;
    const phi = Math.PI * (3.0 - Math.sqrt(5.0));
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      nodeTargets.push(new THREE.Vector3(center.x + x * nodeRadius, center.y + y * nodeRadius, center.z + z * nodeRadius));
    }
  });

  for (let i = 0; i < nodeCenters.length; i++) {
    if (!nodeCenters[i].children) continue;
    const parent = nodeCenters[i];
    nodeCenters[i].children.forEach(childIndex => {
      if (childIndex < nodeCenters.length) {
        const child = nodeCenters[childIndex];
        for (let j = 0; j < particlesPerLink; j++) {
          linkTargets.push(new THREE.Vector3().lerpVectors(parent, child, j / (particlesPerLink - 1)));
        }
      }
    });
  }
  
  return { nodeTargets, linkTargets };
}

// --- ALL TREE & GRAPH GENERATORS ---
function generatePerfectBinaryTree({ levels = 3, width = 4.5, height = 4.5 }) {
    const nodeCenters = [];
    const top = height * 0.45;
    let index = 0;
    for (let level = 0; level < levels; level++) {
        const nodesInLevel = 2 ** level;
        const y = top - (level / (levels - 1)) * (height * 0.9);
        const spacing = (width * 0.9) / nodesInLevel;
        for (let i = 0; i < nodesInLevel; i++) {
            const x = -width * 0.45 + spacing / 2 + i * spacing;
            const children = [];
            if (level < levels - 1) {
                const leftChild = index + nodesInLevel - i + (i*2) + 1;
                children.push(leftChild, leftChild + 1);
            }
            nodeCenters.push({ x, y: y + yPositionOffset, z: 0, children });
            index++;
        }
    }
    return createParticleTargets(nodeCenters);
}

function generateCompleteBinaryTree({ nodes = 11, width = 5, height = 4.5 }) {
    const nodeCenters = [];
    const top = height * 0.45;
    for (let i = 0; i < nodes; i++) {
        const level = Math.floor(Math.log2(i + 1));
        const posInLevel = i - (2 ** level - 1);
        const nodesInLevel = 2 ** level;
        const y = top - level * 1.5;
        const spacing = width / nodesInLevel;
        const x = -width / 2 + spacing / 2 + posInLevel * spacing;
        const children = [];
        const leftChild = 2 * i + 1;
        const rightChild = 2 * i + 2;
        if (leftChild < nodes) children.push(leftChild);
        if (rightChild < nodes) children.push(rightChild);
        nodeCenters.push({ x, y: y + yPositionOffset, z: 0, children });
    }
    return createParticleTargets(nodeCenters);
}

function generateSkewedTree({ levels = 7, height = 4.5 }) {
  const nodeCenters = [];
  const top = height * 0.45;
  for (let level = 0; level < levels; level++) {
    const x = -1.5 + level * 0.5;
    const y = top - level * 0.6;
    const children = level < levels - 1 ? [level + 1] : [];
    nodeCenters.push({ x, y: y + yPositionOffset, z: 0, children });
  }
  return createParticleTargets(nodeCenters);
}

function generateRandomTree({ nodes = 15, width = 5, height = 5 }) {
    const nodeCenters = [];
    for (let i = 0; i < nodes; i++) {
        nodeCenters.push({
            x: (Math.random() - 0.5) * width,
            y: (Math.random() - 0.5) * height + yPositionOffset,
            z: (Math.random() - 0.5) * (width / 2),
            children: []
        });
    }
    for (let i = 1; i < nodes; i++) {
        const parentIndex = Math.floor(Math.random() * i);
        if (nodeCenters[parentIndex].children.length < 3) {
             nodeCenters[parentIndex].children.push(i);
        }
    }
    return createParticleTargets(nodeCenters);
}

function generateStarGraph({ count = 8, radius = 2.5 }) {
    const nodeCenters = [{ x: 0, y: 0 + yPositionOffset, z: 0, children: [] }];
    for (let i = 1; i <= count; i++) {
        const angle = (i / count) * Math.PI * 2;
        nodeCenters[0].children.push(i);
        nodeCenters.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle) + yPositionOffset,
            z: 0,
            children: []
        });
    }
    return createParticleTargets(nodeCenters);
}

function generateGridGraph({ width = 3, height = 3, spacing = 1.5 }) {
    const nodeCenters = [];
    const startX = -((width - 1) * spacing) / 2;
    const startY = ((height - 1) * spacing) / 2;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const children = [];
            const currentIndex = y * width + x;
            if (x < width - 1) children.push(currentIndex + 1);
            if (y < height - 1) children.push(currentIndex + width);
            nodeCenters.push({ x: startX + x * spacing, y: startY - y * spacing + yPositionOffset, z: 0, children });
        }
    }
    return createParticleTargets(nodeCenters);
}

function generateCircularGraph({ count = 10, radius = 2.5 }) {
    const nodeCenters = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        nodeCenters.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle) + yPositionOffset,
            z: 0,
            children: [(i + 1) % count]
        });
    }
    return createParticleTargets(nodeCenters);
}

function generateHelix({ count = 25, radius = 2, height = 5, coils = 3 }) {
    const nodeCenters = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 * coils;
        nodeCenters.push({
            x: radius * Math.cos(angle),
            y: (i / count) * height - height / 2 + yPositionOffset,
            z: radius * Math.sin(angle),
            children: i > 0 ? [i - 1] : []
        });
    }
    return createParticleTargets(nodeCenters);
}

function generateSphere({ count = 20, radius = 2.5 }) {
    const nodeCenters = [];
    const phi = Math.PI * (3.0 - Math.sqrt(5.0));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;
        nodeCenters.push({
            x: Math.cos(theta) * r * radius,
            y: y * radius + yPositionOffset,
            z: Math.sin(theta) * r * radius,
            children: i > 0 ? [Math.floor(i / 2)] : []
        });
    }
    return createParticleTargets(nodeCenters);
}


// --- ANIMATION COMPONENT ---
function ParticleSystem() {
  const nodeRef = useRef();
  const linkRef = useRef();
  const randomAttributes = useRef({});
  const lastShapeIndex = useRef(-1);

  const shapes = useMemo(() => [
    generatePerfectBinaryTree({}),
    generateStarGraph({}),
    generateSkewedTree({}),
    generateGridGraph({}),
    generateCompleteBinaryTree({}),
    generateCircularGraph({}),
    generateHelix({}),
    generateSphere({}),
    generateRandomTree({})
  ], []);

  const maxNodes = useMemo(() => Math.max(...shapes.map(s => s.nodeTargets.length)), [shapes]);
  const maxLinks = useMemo(() => Math.max(...shapes.map(s => s.linkTargets.length)), [shapes]);
  
  const hiddenParticle = useMemo(() => new THREE.Vector3(1000, 1000, 1000), []);

  const paddedShapes = useMemo(() => {
    return shapes.map(shape => ({
      nodeTargets: [...shape.nodeTargets].concat(Array(Math.max(0, maxNodes - shape.nodeTargets.length)).fill(hiddenParticle)),
      linkTargets: [...shape.linkTargets].concat(Array(Math.max(0, maxLinks - shape.linkTargets.length)).fill(hiddenParticle)),
    }));
  }, [shapes, maxNodes, maxLinks, hiddenParticle]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const animateParticles = (ref, maxCount, shapes, shapeIndex, nextShapeIndex, morphT, baseScale, randoms) => {
    if (!ref.current) return;
    
    const currentTargets = shapes[shapeIndex];
    const nextTargets = shapes[nextShapeIndex];

    for (let i = 0; i < maxCount; i++) {
      const startPos = currentTargets[i];
      const endPos = nextTargets[i];

      const isHiddenInStart = startPos.x > 999;
      const isHiddenInEnd = endPos.x > 999;

      let finalPos;
      if (isHiddenInStart && !isHiddenInEnd) { // Appearing
        const randomStartPos = randoms[i].clone().add(endPos);
        finalPos = new THREE.Vector3().lerpVectors(randomStartPos, endPos, morphT);
      } else if (!isHiddenInStart && isHiddenInEnd) { // Disappearing
        const randomEndPos = randoms[i].clone().add(startPos);
        finalPos = new THREE.Vector3().lerpVectors(startPos, randomEndPos, morphT);
      } else { // Moving or staying hidden
        finalPos = new THREE.Vector3().lerpVectors(startPos, endPos, morphT);
      }
      
      dummy.position.copy(finalPos);
      
      let scale = baseScale;
      const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const appearT = easeInOutCubic(Math.min(1, morphT * 2));
      const disappearT = easeInOutCubic(Math.max(0, 1 - (morphT * 2)));

      if (isHiddenInStart && !isHiddenInEnd) {
        scale *= appearT;
      } else if (!isHiddenInStart && isHiddenInEnd) {
        scale *= disappearT;
      } else if (isHiddenInStart && isHiddenInEnd) {
        scale = 0;
      }
      
      dummy.scale.setScalar(Math.max(0, scale));
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycleDuration = 7;
    const cycleTime = t % cycleDuration;
    const shapeIndex = Math.floor(t / cycleDuration) % shapes.length;
    const nextShapeIndex = (shapeIndex + 1) % shapes.length;
    
    if (shapeIndex !== lastShapeIndex.current) {
        randomAttributes.current.nodes = Array.from({ length: maxNodes }, () => new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 1.5));
        randomAttributes.current.links = Array.from({ length: maxLinks }, () => new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 1.0));
        lastShapeIndex.current = shapeIndex;
    }

    const progress = cycleTime / cycleDuration;
    const morphT = 0.5 - 0.5 * Math.cos(progress * Math.PI);

    if (randomAttributes.current.nodes) {
        animateParticles(nodeRef, maxNodes, paddedShapes.map(s => s.nodeTargets), shapeIndex, nextShapeIndex, morphT, 0.035, randomAttributes.current.nodes);
    }
    if (randomAttributes.current.links) {
        animateParticles(linkRef, maxLinks, paddedShapes.map(s => s.linkTargets), shapeIndex, nextShapeIndex, morphT, 0.025, randomAttributes.current.links);
    }
  });

  return (
    <>
      <instancedMesh ref={nodeRef} args={[null, null, maxNodes]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#0FA683" />
      </instancedMesh>
      <instancedMesh ref={linkRef} args={[null, null, maxLinks]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#C6A15B" />
      </instancedMesh>
    </>
  );
}

// --- MAIN CANVAS COMPONENT ---
export default function ParticleTree3D({
  background = "#F8F7F5",
  cameraPosition = [0, 0, 8.5],
}) {
  return (
    <div style={{ width: "100%", height: "100%", background }}>
      <Canvas camera={{ position: cameraPosition, fov: 45 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <ParticleSystem />
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
        </EffectComposer>
        <OrbitControls enablePan={true} enableZoom={true} target={[0, yPositionOffset, 0]} />
      </Canvas>
    </div>
  );
}