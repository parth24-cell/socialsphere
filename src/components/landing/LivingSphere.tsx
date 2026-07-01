"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "framer-motion";
import { useSphere } from "./SphereContext";

// --- Configuration ---
const PARTICLE_COUNT = 250; 
const MAX_LINES = 800;
const CONNECTION_DISTANCE = 1.8;

// Premium Palette
const C_BASE = new THREE.Color("#1e293b"); // Slate 800
const C_MESSAGING = new THREE.Color("#8b5cf6"); // Soft Violet
const C_STORIES = new THREE.Color("#06b6d4"); // Electric Cyan
const C_FEED = new THREE.Color("#10b981"); // Emerald
const C_COMMUNITIES = new THREE.Color("#3b82f6"); // Blue
const C_AUTH = new THREE.Color("#3b82f6"); // Blue Shield
const C_CREATOR = new THREE.Color("#fbbf24"); // Warm Gold
const C_AI = new THREE.Color("#ffffff"); // Pure White
const C_CTA = new THREE.Color("#ffffff"); // Pure White

// Utility
const damp = THREE.MathUtils.damp;

function SphereEngine() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const glowRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const { scrollYProgress } = useScroll();
  const { activeFeature } = useSphere();
  const { camera, pointer } = useThree();

  // --- Initial State Generation ---
  const { originalPositions, baseScales, phases, clusterIds, layers } = useMemo(() => {
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const bScales = new Float32Array(PARTICLE_COUNT);
    const phs = new Float32Array(PARTICLE_COUNT);
    const cIds = new Float32Array(PARTICLE_COUNT);
    const lyrs = new Float32Array(PARTICLE_COUNT); // 0=Core, 1=Mid, 2=Outer

    const phi = Math.PI * (3 - Math.sqrt(5)); 

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; 
      const radius2D = Math.sqrt(1 - y * y);
      const theta = phi * i;

      // Assign to one of 3 depth layers for real volume
      let radiusMultiplier = 3.5; // Outer
      let layer = 2;
      const rand = Math.random();
      if (rand < 0.2) { radiusMultiplier = 1.5; layer = 0; } // Core
      else if (rand < 0.6) { radiusMultiplier = 2.5; layer = 1; } // Mid

      const x = Math.cos(theta) * radius2D * radiusMultiplier;
      const yPos = y * radiusMultiplier;
      const z = Math.sin(theta) * radius2D * radiusMultiplier;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = yPos;
      origPos[i * 3 + 2] = z;

      // Outer nodes are slightly smaller, core nodes larger
      bScales[i] = layer === 0 ? 0.08 : layer === 1 ? 0.05 : 0.03;
      // Add subtle random variation
      bScales[i] *= 0.8 + Math.random() * 0.4;

      phs[i] = Math.random() * Math.PI * 2;
      cIds[i] = Math.floor(Math.random() * 5); // 5 communities
      lyrs[i] = layer;
    }
    return { originalPositions: origPos, baseScales: bScales, phases: phs, clusterIds: cIds, layers: lyrs };
  }, []);

  // --- Physics State ---
  // Using React refs to avoid recreation and track current state for smooth interpolation
  const currentPositions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);
  const currentColors = useMemo(() => Array.from({ length: PARTICLE_COUNT }, () => C_BASE.clone()), []);
  const currentScales = useMemo(() => new Float32Array(baseScales), [baseScales]);
  
  // Connection line buffers
  const linePositions = useMemo(() => new Float32Array(MAX_LINES * 6), []);
  const lineColors = useMemo(() => new Float32Array(MAX_LINES * 6), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    if (!meshRef.current || !linesRef.current || !glowRef.current || !groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const scrollVal = scrollYProgress.get();

    // 1. Interaction (Effortless Parallax)
    // Map mouse pointer gently to rotation and position
    const targetRotX = pointer.y * 0.1 + scrollVal * 0.5;
    const targetRotY = pointer.x * 0.1 + time * 0.05;
    
    groupRef.current.rotation.x = damp(groupRef.current.rotation.x, targetRotX, 2, delta);
    groupRef.current.rotation.y = damp(groupRef.current.rotation.y, targetRotY, 2, delta);
    
    // Slight camera push/pull on scroll
    camera.position.z = damp(camera.position.z, 9 - (scrollVal * 1.0), 1, delta);

    let lineCount = 0;

    // 2. Node Updates
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const origX = originalPositions[i * 3];
      const origY = originalPositions[i * 3 + 1];
      const origZ = originalPositions[i * 3 + 2];
      const phase = phases[i];
      const layer = layers[i];
      
      let tX = origX;
      let tY = origY;
      let tZ = origZ;
      let tColor = C_BASE;
      let tScale = baseScales[i];
      
      const distFromCenter = Math.sqrt(origX*origX + origY*origY + origZ*origZ);

      // --- Feature Specific Morphing (Elegant, Subdued) ---
      if (activeFeature === 'messaging') {
         const wave = Math.sin(origY * 2.0 - time * 3.0) * 0.5 + 0.5;
         if (wave > 0.85) {
            tColor = C_MESSAGING;
            tScale *= 1.5;
            tX += (origX/distFromCenter) * 0.2;
            tZ += (origZ/distFromCenter) * 0.2;
         }
      } else if (activeFeature === 'stories') {
         // Cyan orbital ribbons around Y axis
         const angle = Math.atan2(origZ, origX);
         const ribbon = Math.sin(angle * 3 - time * 2) * 0.5 + 0.5;
         if (ribbon > 0.8 && layer > 0) {
            tColor = C_STORIES;
            tY += Math.sin(time + phase) * 0.3;
            tScale *= 1.3;
         }
      } else if (activeFeature === 'feed') {
         // Tiny isolated emerald activity bursts
         const isBurst = Math.sin(time * 5 + phase * 10) > 0.98;
         if (isBurst) {
            tColor = C_FEED;
            tScale *= 2.0;
         }
      } else if (activeFeature === 'communities') {
         // Graceful clustering
         const cId = clusterIds[i];
         const cAngle = (cId / 5) * Math.PI * 2;
         const cx = Math.cos(cAngle) * 2.5;
         const cy = Math.sin(cId + time * 0.2) * 1.5;
         const cz = Math.sin(cAngle) * 2.5;
         
         // Interpolate towards cluster center, keep some original structure
         tX = origX * 0.4 + cx * 0.6;
         tY = origY * 0.4 + cy * 0.6;
         tZ = origZ * 0.4 + cz * 0.6;
         
         const wave = Math.sin(time + phase) * 0.5 + 0.5;
         if (wave > 0.8) {
            tColor = C_COMMUNITIES;
         }
      } else if (activeFeature === 'auth') {
         // Symmetrical protective shield
         const pulse = Math.sin(time * 1.5) * 0.05 + 1.0;
         tX *= pulse;
         tY *= pulse;
         tZ *= pulse;
         
         if (layer === 2 && Math.abs(origY) < 1.0) {
            tColor = C_AUTH;
            tScale *= 1.2;
         }
      } else if (activeFeature === 'creator') {
         // Golden energy from core
         if (layer === 0 || (layer === 1 && Math.sin(time*2 + phase) > 0.5)) {
            tColor = C_CREATOR;
            tScale *= 1.4;
         }
         // Expand slightly
         tX *= 1.05; tY *= 1.05; tZ *= 1.05;
      } else if (activeFeature === 'ai') {
         // White intelligence scan along Y
         const scanY = Math.sin(time * 2) * 3.5;
         if (Math.abs(origY - scanY) < 0.6) {
            tColor = C_AI;
            tScale *= 1.8;
         }
      } else if (activeFeature === 'cta') {
         // Unified elegant climax
         const pulse = Math.sin(distFromCenter - time * 3) * 0.5 + 0.5;
         tColor = C_BASE.clone().lerp(C_CTA, pulse * 0.8);
         tScale *= 1.0 + (pulse * 0.5);
         tX += (origX/distFromCenter) * pulse * 0.3;
         tY += (origY/distFromCenter) * pulse * 0.3;
         tZ += (origZ/distFromCenter) * pulse * 0.3;
      } else {
         // Idle organic breathing
         tX += Math.sin(time * 0.5 + phase) * 0.05;
         tY += Math.cos(time * 0.4 + phase) * 0.05;
         tZ += Math.sin(time * 0.6 + phase) * 0.05;
      }

      // Smooth Interpolation (1-2 seconds feel)
      const DAMP_FACTOR = 3.0; // Lower = slower, smoother transitions
      
      currentPositions[i*3] = damp(currentPositions[i*3], tX, DAMP_FACTOR, delta);
      currentPositions[i*3+1] = damp(currentPositions[i*3+1], tY, DAMP_FACTOR, delta);
      currentPositions[i*3+2] = damp(currentPositions[i*3+2], tZ, DAMP_FACTOR, delta);
      
      currentScales[i] = damp(currentScales[i], tScale, DAMP_FACTOR * 1.5, delta);
      
      currentColors[i].lerp(tColor, damp(0, 1, DAMP_FACTOR, delta));

      // Update InstancedMesh
      dummy.position.set(currentPositions[i*3], currentPositions[i*3+1], currentPositions[i*3+2]);
      dummy.scale.setScalar(currentScales[i]);
      // Make nodes face camera for soft highlights if they are flat, but we use icosahedrons
      dummy.rotation.x = time * 0.2 + phase;
      dummy.rotation.y = time * 0.3 + phase;
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, currentColors[i]);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // Sync glow points with instanced mesh positions
    const glowPosAttr = glowRef.current.geometry.attributes.position;
    const glowColAttr = glowRef.current.geometry.attributes.color;
    for(let i=0; i<PARTICLE_COUNT; i++) {
       glowPosAttr.setXYZ(i, currentPositions[i*3], currentPositions[i*3+1], currentPositions[i*3+2]);
       // Only glow significantly if color isn't base
       const dr = currentColors[i].r - C_BASE.r;
       const dg = currentColors[i].g - C_BASE.g;
       const db = currentColors[i].b - C_BASE.b;
       const distSq = dr*dr + dg*dg + db*db;
       const isBase = distSq < 0.01;
       const alpha = isBase ? 0.1 : 0.8;
       glowColAttr.setXYZ(i, currentColors[i].r * alpha, currentColors[i].g * alpha, currentColors[i].b * alpha);
    }
    glowPosAttr.needsUpdate = true;
    glowColAttr.needsUpdate = true;

    // 3. Stable Constellation Connections
    // Calculate connections dynamically but smoothly fading
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        if (lineCount >= MAX_LINES) break;

        const dX = currentPositions[i*3] - currentPositions[j*3];
        const dY = currentPositions[i*3+1] - currentPositions[j*3+1];
        const dZ = currentPositions[i*3+2] - currentPositions[j*3+2];
        const distSq = dX*dX + dY*dY + dZ*dZ;
        
        let connDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
        // Increase connection distance when clustered to form denser nets
        if (activeFeature === 'communities' && clusterIds[i] === clusterIds[j]) {
            connDistSq *= 1.5;
        }

        if (distSq < connDistSq) {
          // Smooth opacity based on distance (inverse square)
          const dist = Math.sqrt(distSq);
          const maxDist = Math.sqrt(connDistSq);
          const alpha = Math.pow(1.0 - (dist / maxDist), 2) * 0.4; // Max 40% opacity
          
          linePositions[lineCount * 6] = currentPositions[i*3];
          linePositions[lineCount * 6 + 1] = currentPositions[i*3+1];
          linePositions[lineCount * 6 + 2] = currentPositions[i*3+2];
          linePositions[lineCount * 6 + 3] = currentPositions[j*3];
          linePositions[lineCount * 6 + 4] = currentPositions[j*3+1];
          linePositions[lineCount * 6 + 5] = currentPositions[j*3+2];

          // Mix colors of the two connected nodes
          lineColors[lineCount * 6] = currentColors[i].r * alpha;
          lineColors[lineCount * 6 + 1] = currentColors[i].g * alpha;
          lineColors[lineCount * 6 + 2] = currentColors[i].b * alpha;
          
          lineColors[lineCount * 6 + 3] = currentColors[j].r * alpha;
          lineColors[lineCount * 6 + 4] = currentColors[j].g * alpha;
          lineColors[lineCount * 6 + 5] = currentColors[j].b * alpha;

          lineCount++;
        }
      }
    }

    const linesPosAttr = linesRef.current.geometry.attributes.position;
    const linesColAttr = linesRef.current.geometry.attributes.color;
    
    for(let i = 0; i < lineCount * 6; i++) {
        linesPosAttr.array[i] = linePositions[i];
        linesColAttr.array[i] = lineColors[i];
    }
    
    linesRef.current.geometry.setDrawRange(0, lineCount * 2);
    linesPosAttr.needsUpdate = true;
    linesColAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Internal Point Light for glass illumination */}
      <pointLight position={[0, 0, 0]} distance={10} intensity={2} color="#ffffff" />
      <ambientLight intensity={0.2} />

      {/* Premium Glass-like Nodes */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        {/* Icosahedron provides a nice multifaceted gem look */}
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial 
           roughness={0.2}
           metalness={0.8}
           clearcoat={1.0}
           clearcoatRoughness={0.1}
           transparent={true}
           opacity={0.85}
        />
      </instancedMesh>

      {/* Soft Glow overlay for active nodes */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(PARTICLE_COUNT * 3), 3]} usage={THREE.DynamicDrawUsage} />
          <bufferAttribute attach="attributes-color" args={[new Float32Array(PARTICLE_COUNT * 3), 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial 
           size={0.25}
           vertexColors
           transparent
           opacity={1.0}
           blending={THREE.AdditiveBlending}
           depthWrite={false}
           map={createSoftGlowTexture()}
        />
      </points>

      {/* Ultra-thin Constellation Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} usage={THREE.DynamicDrawUsage} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <lineBasicMaterial 
           vertexColors
           transparent
           opacity={0.8}
           blending={THREE.AdditiveBlending}
           depthWrite={false}
           linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

// Utility to create a soft radial gradient for the point glows
function createSoftGlowTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function LivingSphere() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto bg-[#020205]">
      {/* Premium Cinematic Lighting Layers */}
      
      {/* Deep Space Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A0A1F]/30 via-[#020205] to-[#010103] pointer-events-none" />
      
      {/* Subtle Ambient Glow from bottom to separate sphere from background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 via-transparent to-transparent pointer-events-none" />
      
      {/* Film Grain Texture for cinematic texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <Canvas
        camera={{ position: [0, 0, 9], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* Deep distance fog for depth of field illusion */}
        <fog attach="fog" args={["#020205", 5, 15]} />
        <SphereEngine />
      </Canvas>
    </div>
  );
}
