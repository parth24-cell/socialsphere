"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "framer-motion";
import { useSphere } from "./SphereContext";

// Phase 1 Redesign: Engineered, minimal, elegant.
const PARTICLE_COUNT = 210; 
const SPHERE_RADIUS = 3.5;
const CONNECTION_DISTANCE = 1.1;

// Colors matching the cinematic design language
const COLOR_IDLE_BASE = new THREE.Color("#4a4a4a"); // Dark grey
const COLOR_IDLE_HIGH = new THREE.Color("#888888"); // Light grey

const COLOR_MESSAGING = new THREE.Color("#a855f7"); // Purple communication pulses
const COLOR_STORIES = new THREE.Color("#3b82f6"); // Blue flowing waves
const COLOR_FEED = new THREE.Color("#10b981"); // Emerald bursts
const COLOR_COMMUNITIES = new THREE.Color("#06b6d4"); // Cyan clusters
const COLOR_AUTH = new THREE.Color("#6366f1"); // Indigo shield pulse
const COLOR_CREATOR = new THREE.Color("#fbbf24"); // Golden intelligence wave
const COLOR_AI = new THREE.Color("#ffffff"); // White neural scan
const COLOR_CTA = new THREE.Color("#ffffff"); // Bright white climax

// Utility for hashing an edge
function hashEdge(i: number, j: number) {
  const a = Math.min(i, j);
  const b = Math.max(i, j);
  let h = (a * 104729 + b * 224689) % 1000000;
  return h / 1000000.0;
}

function SphereNodes() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const packetsRef = useRef<THREE.Points>(null);
  
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const { activeFeature } = useSphere();

  // Generate node positions in a sphere
  const [originalPositions, baseColors, phases, clusterIds] = useMemo(() => {
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const phs = new Float32Array(PARTICLE_COUNT);
    const cIds = new Float32Array(PARTICLE_COUNT);

    // Golden ratio spiral for perfectly distributed nodes
    const phi = Math.PI * (3 - Math.sqrt(5)); 

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; 
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radius * SPHERE_RADIUS;
      const yPos = y * SPHERE_RADIUS;
      const z = Math.sin(theta) * radius * SPHERE_RADIUS;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = yPos;
      origPos[i * 3 + 2] = z;

      const mixedColor = COLOR_IDLE_BASE.clone().lerp(COLOR_IDLE_HIGH, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      phs[i] = Math.random() * Math.PI * 2;
      
      // Assign to one of 4 clusters for 'communities' feature
      cIds[i] = Math.floor(Math.random() * 4);
    }
    return [origPos, col, phs, cIds];
  }, []);

  const maxLines = PARTICLE_COUNT * 8; // Restrict max lines for elegance
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  
  // Packets
  const packetPositions = useMemo(() => new Float32Array(maxLines * 3), [maxLines]);
  const packetColors = useMemo(() => new Float32Array(maxLines * 3), [maxLines]);

  // Current physics state (for smooth interpolation)
  const currentPositions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);
  const currentColors = useMemo(() => new Float32Array(baseColors), [baseColors]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current || !packetsRef.current) return;

    const time = state.clock.getElapsedTime();
    const scrollVal = scrollYProgress.get();
    
    // Smooth, cinematic overall rotation
    pointsRef.current.rotation.y = time * 0.05 + scrollVal * Math.PI * 0.2;
    pointsRef.current.rotation.x = scrollVal * Math.PI * 0.2;
    
    linesRef.current.rotation.y = pointsRef.current.rotation.y;
    linesRef.current.rotation.x = pointsRef.current.rotation.x;
    
    packetsRef.current.rotation.y = pointsRef.current.rotation.y;
    packetsRef.current.rotation.x = pointsRef.current.rotation.x;

    // Cinematic camera push/pull
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 - (scrollVal * 1.5), 0.05);

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const colorsAttr = pointsRef.current.geometry.attributes.color;
    
    let lineCount = 0;
    let packetCount = 0;

    // 1. Calculate target positions and colors for this frame based on active feature
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const origX = originalPositions[i * 3];
      const origY = originalPositions[i * 3 + 1];
      const origZ = originalPositions[i * 3 + 2];

      let targetX = origX;
      let targetY = origY;
      let targetZ = origZ;
      
      let targetR = baseColors[i * 3];
      let targetG = baseColors[i * 3 + 1];
      let targetB = baseColors[i * 3 + 2];
      
      const distFromCenter = Math.sqrt(origX*origX + origY*origY + origZ*origZ);

      // --- Feature Specific Morphing & Coloring ---

      if (activeFeature === 'messaging') {
         // Purple communication pulses (traveling Y waves)
         const wave = Math.sin(origY * 1.5 - time * 2) * 0.5 + 0.5;
         if (wave > 0.8) {
            targetR = COLOR_MESSAGING.r;
            targetG = COLOR_MESSAGING.g;
            targetB = COLOR_MESSAGING.b;
            targetX += origX * 0.05;
            targetZ += origZ * 0.05;
         }
      } else if (activeFeature === 'stories') {
         // Blue flowing waves (X axis sweeping)
         const ripple = Math.sin(origX * 2 - time * 3) * 0.5 + 0.5;
         if (ripple > 0.7) {
            targetR = COLOR_STORIES.r;
            targetG = COLOR_STORIES.g;
            targetB = COLOR_STORIES.b;
            targetY += Math.sin(time * 3 + phases[i]) * 0.2;
         }
      } else if (activeFeature === 'feed') {
         // Emerald bursts (random nodes light up)
         const isGlowing = Math.sin(time * 4 + phases[i] * 8) > 0.95;
         if (isGlowing) {
            targetR = COLOR_FEED.r;
            targetG = COLOR_FEED.g;
            targetB = COLOR_FEED.b;
         }
      } else if (activeFeature === 'communities') {
         // Cluster formation
         const cId = clusterIds[i];
         const angle = (cId / 4) * Math.PI * 2;
         
         // Clusters pull away from center
         const cx = Math.cos(angle + time * 0.1) * (SPHERE_RADIUS * 1.2);
         const cy = Math.sin(time * 0.2 + cId) * 1.0;
         const cz = Math.sin(angle + time * 0.1) * (SPHERE_RADIUS * 1.2);
         
         targetX = THREE.MathUtils.lerp(origX, cx + (origX * 0.3), 0.8);
         targetY = THREE.MathUtils.lerp(origY, cy + (origY * 0.3), 0.8);
         targetZ = THREE.MathUtils.lerp(origZ, cz + (origZ * 0.3), 0.8);
         
         const wave = Math.sin(time * 2 + phases[i]) * 0.5 + 0.5;
         if (wave > 0.7) {
             targetR = COLOR_COMMUNITIES.r;
             targetG = COLOR_COMMUNITIES.g;
             targetB = COLOR_COMMUNITIES.b;
         }
      } else if (activeFeature === 'auth') {
         // Shield pulse (expanding and contracting slightly)
         const pulse = Math.sin(time * 2) * 0.05 + 1;
         targetX *= pulse;
         targetY *= pulse;
         targetZ *= pulse;
         
         // Indigo glow on the equator
         const equator = 1.0 - Math.abs(origY) / SPHERE_RADIUS;
         if (equator > 0.7) {
            targetR = COLOR_AUTH.r;
            targetG = COLOR_AUTH.g;
            targetB = COLOR_AUTH.b;
         }
      } else if (activeFeature === 'creator') {
         // Golden intelligence wave (slow radial pulse)
         const pulse = Math.sin(distFromCenter * 2 - time * 2) * 0.5 + 0.5;
         if (pulse > 0.5) {
            targetR = COLOR_CREATOR.r;
            targetG = COLOR_CREATOR.g;
            targetB = COLOR_CREATOR.b;
            targetY += pulse * 0.2;
         }
      } else if (activeFeature === 'ai') {
         // White neural scan line (Z axis plane sweeping)
         const scanZ = Math.sin(time * 1.5) * SPHERE_RADIUS;
         const distToScan = Math.abs(origZ - scanZ);
         if (distToScan < 0.5) {
            targetR = COLOR_AI.r;
            targetG = COLOR_AI.g;
            targetB = COLOR_AI.b;
            targetX += origX * 0.1;
            targetY += origY * 0.1;
         }
      } else if (activeFeature === 'cta') {
         // Bright white climax
         const pulse = Math.sin(distFromCenter - time * 4) * 0.5 + 0.5;
         if (pulse > 0.4) {
            targetR = COLOR_CTA.r;
            targetG = COLOR_CTA.g;
            targetB = COLOR_CTA.b;
            targetX += (origX / distFromCenter) * pulse * 0.3;
            targetY += (origY / distFromCenter) * pulse * 0.3;
            targetZ += (origZ / distFromCenter) * pulse * 0.3;
         }
      } else {
         // Idle floating
         targetX += Math.sin(time * 0.5 + phases[i]) * 0.1;
         targetY += Math.cos(time * 0.4 + phases[i]) * 0.1;
         targetZ += Math.sin(time * 0.6 + phases[i]) * 0.1;
      }

      // 2. Smoothly interpolate current state to target state
      // We use a high lerp factor for snappy but smooth movement
      const LERP_SPEED = delta * 3.0; 
      
      currentPositions[i * 3] = THREE.MathUtils.lerp(currentPositions[i * 3], targetX, LERP_SPEED);
      currentPositions[i * 3 + 1] = THREE.MathUtils.lerp(currentPositions[i * 3 + 1], targetY, LERP_SPEED);
      currentPositions[i * 3 + 2] = THREE.MathUtils.lerp(currentPositions[i * 3 + 2], targetZ, LERP_SPEED);

      currentColors[i * 3] = THREE.MathUtils.lerp(currentColors[i * 3], targetR, LERP_SPEED);
      currentColors[i * 3 + 1] = THREE.MathUtils.lerp(currentColors[i * 3 + 1], targetG, LERP_SPEED);
      currentColors[i * 3 + 2] = THREE.MathUtils.lerp(currentColors[i * 3 + 2], targetB, LERP_SPEED);

      positionsAttr.setXYZ(i, currentPositions[i * 3], currentPositions[i * 3 + 1], currentPositions[i * 3 + 2]);
      colorsAttr.setXYZ(i, currentColors[i * 3], currentColors[i * 3 + 1], currentColors[i * 3 + 2]);

      // 3. Build lines and packets
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const x2 = currentPositions[j * 3];
        const y2 = currentPositions[j * 3 + 1];
        const z2 = currentPositions[j * 3 + 2];

        const dX = currentPositions[i * 3] - x2;
        const dY = currentPositions[i * 3 + 1] - y2;
        const dZ = currentPositions[i * 3 + 2] - z2;
        const dist = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
        
        // Dynamically adjust connection distance slightly based on feature
        let localConnDist = CONNECTION_DISTANCE;
        if (activeFeature === 'communities' && clusterIds[i] === clusterIds[j]) {
            localConnDist = CONNECTION_DISTANCE * 1.5; // Connect more within clusters
        } else if (activeFeature === 'communities' && clusterIds[i] !== clusterIds[j]) {
            localConnDist = CONNECTION_DISTANCE * 0.5; // Connect less between clusters
        }

        if (dist < localConnDist && lineCount < maxLines) {
          // Fade out lines near the max distance for elegance
          const alpha = Math.pow(1.0 - (dist / localConnDist), 2) * 0.6; // Keep lines subtle
          
          linePositions[lineCount * 6] = currentPositions[i * 3];
          linePositions[lineCount * 6 + 1] = currentPositions[i * 3 + 1];
          linePositions[lineCount * 6 + 2] = currentPositions[i * 3 + 2];
          linePositions[lineCount * 6 + 3] = x2;
          linePositions[lineCount * 6 + 4] = y2;
          linePositions[lineCount * 6 + 5] = z2;

          lineColors[lineCount * 6] = currentColors[i * 3] * alpha;
          lineColors[lineCount * 6 + 1] = currentColors[i * 3 + 1] * alpha;
          lineColors[lineCount * 6 + 2] = currentColors[i * 3 + 2] * alpha;
          
          lineColors[lineCount * 6 + 3] = currentColors[j * 3] * alpha;
          lineColors[lineCount * 6 + 4] = currentColors[j * 3 + 1] * alpha;
          lineColors[lineCount * 6 + 5] = currentColors[j * 3 + 2] * alpha;

          // -- Traveling Packets Logic --
          const edgeHash = hashEdge(i, j);
          // Only spawn packets on 15% of active edges to keep it clean
          if (edgeHash < 0.15) {
             const speed = 0.5 + (edgeHash * 2); // random speed per edge
             // Calculate position along the line (0 to 1)
             let progress = (time * speed + edgeHash * 10) % 1;
             
             // Sine easing for smoother travel
             const easedProgress = Math.sin(progress * Math.PI - (Math.PI/2)) * 0.5 + 0.5;

             packetPositions[packetCount * 3] = THREE.MathUtils.lerp(currentPositions[i * 3], x2, easedProgress);
             packetPositions[packetCount * 3 + 1] = THREE.MathUtils.lerp(currentPositions[i * 3 + 1], y2, easedProgress);
             packetPositions[packetCount * 3 + 2] = THREE.MathUtils.lerp(currentPositions[i * 3 + 2], z2, easedProgress);

             // Packet takes the color of the source node but brighter
             const packetAlpha = Math.sin(progress * Math.PI); // Fade in and out at ends
             packetColors[packetCount * 3] = currentColors[i * 3] * 1.5 * packetAlpha;
             packetColors[packetCount * 3 + 1] = currentColors[i * 3 + 1] * 1.5 * packetAlpha;
             packetColors[packetCount * 3 + 2] = currentColors[i * 3 + 2] * 1.5 * packetAlpha;

             packetCount++;
          }

          lineCount++;
        }
      }
    }

    positionsAttr.needsUpdate = true;
    colorsAttr.needsUpdate = true;
    
    // Update lines
    const linesAttr = linesRef.current.geometry.attributes.position;
    const lineColorAttr = linesRef.current.geometry.attributes.color;
    
    for(let i=0; i<lineCount * 6; i++) {
        linesAttr.array[i] = linePositions[i];
        lineColorAttr.array[i] = lineColors[i];
    }
    
    linesRef.current.geometry.setDrawRange(0, lineCount * 2);
    linesAttr.needsUpdate = true;
    lineColorAttr.needsUpdate = true;

    // Update packets
    const packetsPosAttr = packetsRef.current.geometry.attributes.position;
    const packetsColorAttr = packetsRef.current.geometry.attributes.color;
    
    for(let i=0; i<packetCount * 3; i++) {
        packetsPosAttr.array[i] = packetPositions[i];
        packetsColorAttr.array[i] = packetColors[i];
    }
    
    packetsRef.current.geometry.setDrawRange(0, packetCount);
    packetsPosAttr.needsUpdate = true;
    packetsColorAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Main Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(PARTICLE_COUNT * 3), 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[new Float32Array(PARTICLE_COUNT * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Traveling Packets */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[packetPositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[packetColors, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={1.0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export function LivingSphere() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto bg-[#020205]">
      {/* Premium Cinematic Lighting Layers */}
      {/* Deep Navy/Purple Base Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A0A1F]/40 via-[#020205] to-[#010103] pointer-events-none" />
      
      {/* Subtle Blue/Purple Ambient Glow from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#100b2e]/30 via-transparent to-transparent pointer-events-none" />
      
      {/* Film Grain Texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <Canvas
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#020205", 6, 18]} />
        <SphereNodes />
      </Canvas>
    </div>
  );
}
