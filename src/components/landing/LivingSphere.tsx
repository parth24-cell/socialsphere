"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "framer-motion";
import { useSphere } from "./SphereContext";

const PARTICLE_COUNT = 350; // Extra 50 for communities
const BASE_PARTICLE_COUNT = 300;
const SPHERE_RADIUS = 3;
const CONNECTION_DISTANCE = 0.8;

// Colors
const COLOR_IDLE_BASE = new THREE.Color("#D97706");
const COLOR_IDLE_HIGH = new THREE.Color("#FDE68A");

const COLOR_MESSAGING = new THREE.Color("#d946ef");
const COLOR_STORIES = new THREE.Color("#3b82f6");
const COLOR_FEED = new THREE.Color("#10b981"); // Emerald
const COLOR_COMMUNITIES = new THREE.Color("#06b6d4");
const COLOR_AUTH = new THREE.Color("#6366f1");
const COLOR_CREATOR = new THREE.Color("#fbbf24"); // Amber/Gold
const COLOR_AI = new THREE.Color("#0ea5e9"); // Cyan
const COLOR_CTA = new THREE.Color("#FCD34D");

function SphereNodes() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const { mouse, camera } = useThree();
  const { scrollYProgress } = useScroll();
  const { activeFeature } = useSphere();

  // Generate node positions in a sphere
  const [positions, originalPositions, baseColors, velocity, phases] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const phs = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      let r = SPHERE_RADIUS + (Math.random() * 0.5 - 0.25);
      
      // The last 50 particles (communities) start slightly further out
      if (i >= BASE_PARTICLE_COUNT) {
        r += 1.5;
      }

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      const mixedColor = COLOR_IDLE_BASE.clone().lerp(COLOR_IDLE_HIGH, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      
      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, origPos, col, vel, phs];
  }, []);

  const maxLines = PARTICLE_COUNT * 12;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const displayColors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;

    const time = state.clock.getElapsedTime();
    const scrollVal = scrollYProgress.get();
    
    // Rotate sphere
    pointsRef.current.rotation.y += delta * (activeFeature === 'auth' ? 0.01 : 0.05);
    pointsRef.current.rotation.x = scrollVal * Math.PI * 0.5;
    linesRef.current.rotation.y = pointsRef.current.rotation.y;
    linesRef.current.rotation.x = pointsRef.current.rotation.x;

    if (ringRef.current) {
       ringRef.current.rotation.y = pointsRef.current.rotation.y;
       ringRef.current.rotation.x = pointsRef.current.rotation.x;
       // Smoothly show/hide auth ring
       const targetScale = activeFeature === 'auth' ? 1 : 0.01;
       ringRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8 - (scrollVal * 2), 0.1);

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const colorsAttr = pointsRef.current.geometry.attributes.color;
    
    let lineCount = 0;
    
    // Determine active node count
    const activeNodesCount = activeFeature === 'communities' || activeFeature === 'cta' ? PARTICLE_COUNT : BASE_PARTICLE_COUNT;

    for (let i = 0; i < activeNodesCount; i++) {
      let x = positionsAttr.getX(i);
      let y = positionsAttr.getY(i);
      let z = positionsAttr.getZ(i);

      const origX = originalPositions[i * 3];
      const origY = originalPositions[i * 3 + 1];
      const origZ = originalPositions[i * 3 + 2];

      // Base color
      let r = baseColors[i * 3];
      let g = baseColors[i * 3 + 1];
      let b = baseColors[i * 3 + 2];
      
      const distFromCenter = Math.sqrt(origX*origX + origY*origY + origZ*origZ);

      // Feature specific animations
      if (activeFeature === 'messaging') {
         // Purple pulse traveling along Y axis
         const wave = Math.sin(origY * 2 - time * 3) * 0.5 + 0.5;
         if (wave > 0.8) {
            r = THREE.MathUtils.lerp(r, COLOR_MESSAGING.r, wave);
            g = THREE.MathUtils.lerp(g, COLOR_MESSAGING.g, wave);
            b = THREE.MathUtils.lerp(b, COLOR_MESSAGING.b, wave);
         }
      } else if (activeFeature === 'stories') {
         // Blue ripple based on distance
         const ripple = Math.sin(distFromCenter * 3 - time * 4) * 0.5 + 0.5;
         if (ripple > 0.7) {
            r = THREE.MathUtils.lerp(r, COLOR_STORIES.r, ripple);
            g = THREE.MathUtils.lerp(g, COLOR_STORIES.g, ripple);
            b = THREE.MathUtils.lerp(b, COLOR_STORIES.b, ripple);
            
            // Orbit effect
            x += Math.cos(time * 2 + phases[i]) * 0.05;
            z += Math.sin(time * 2 + phases[i]) * 0.05;
         }
      } else if (activeFeature === 'feed') {
         // Random nodes light up rapidly
         const isGlowing = Math.sin(time * 5 + phases[i] * 10) > 0.9;
         if (isGlowing) {
            r = COLOR_FEED.r;
            g = COLOR_FEED.g;
            b = COLOR_FEED.b;
            x += (Math.random() - 0.5) * 0.1;
            y += (Math.random() - 0.5) * 0.1;
            z += (Math.random() - 0.5) * 0.1;
         }
      } else if (activeFeature === 'communities') {
         // Cyan color for new nodes, slight pulse for others
         if (i >= BASE_PARTICLE_COUNT) {
            r = COLOR_COMMUNITIES.r;
            g = COLOR_COMMUNITIES.g;
            b = COLOR_COMMUNITIES.b;
            
            // Bring them closer organically
            const targetDist = SPHERE_RADIUS + (Math.sin(phases[i]) * 0.5);
            const currentDist = Math.sqrt(x*x + y*y + z*z);
            const pull = (currentDist - targetDist) * 0.05;
            x -= (x / currentDist) * pull;
            y -= (y / currentDist) * pull;
            z -= (z / currentDist) * pull;
         } else {
            const wave = Math.sin(time * 2 + phases[i]) * 0.5 + 0.5;
            if (wave > 0.9) {
               r = THREE.MathUtils.lerp(r, COLOR_COMMUNITIES.r, 0.5);
               g = THREE.MathUtils.lerp(g, COLOR_COMMUNITIES.g, 0.5);
               b = THREE.MathUtils.lerp(b, COLOR_COMMUNITIES.b, 0.5);
            }
         }
      } else if (activeFeature === 'auth') {
         // Indigo glow, stabilize
         const glow = Math.sin(time + phases[i]) * 0.2 + 0.8;
         r = THREE.MathUtils.lerp(r, COLOR_AUTH.r, glow * 0.5);
         g = THREE.MathUtils.lerp(g, COLOR_AUTH.g, glow * 0.5);
         b = THREE.MathUtils.lerp(b, COLOR_AUTH.b, glow * 0.5);
         
         // Dampen velocity to stabilize
         x += (origX - x) * 0.1;
         y += (origY - y) * 0.1;
         z += (origZ - z) * 0.1;
      } else if (activeFeature === 'creator') {
         // Golden intelligence pulse from center
         const pulse = Math.sin(distFromCenter * 2 - time * 5) * 0.5 + 0.5;
         if (pulse > 0.6) {
            r = THREE.MathUtils.lerp(r, COLOR_CREATOR.r, pulse);
            g = THREE.MathUtils.lerp(g, COLOR_CREATOR.g, pulse);
            b = THREE.MathUtils.lerp(b, COLOR_CREATOR.b, pulse);
            // Slight uplift
            y += pulse * 0.05;
         }
      } else if (activeFeature === 'ai') {
         // Small intelligent clusters reorganize automatically
         // Nodes group into multiple small centers
         const clusterCount = 5;
         const clusterId = i % clusterCount;
         const angle = (clusterId / clusterCount) * Math.PI * 2;
         const targetX = Math.cos(angle + time * 0.2) * (SPHERE_RADIUS * 0.8);
         const targetY = Math.sin(time * 0.5 + clusterId) * 1.5;
         const targetZ = Math.sin(angle + time * 0.2) * (SPHERE_RADIUS * 0.8);
         
         const pull = 0.05;
         x += (targetX - x) * pull;
         y += (targetY - y) * pull;
         z += (targetZ - z) * pull;
         
         const glow = Math.sin(time * 3 + phases[i]) * 0.5 + 0.5;
         // Mix Gold and Cyan
         const mixed = COLOR_AI.clone().lerp(COLOR_CREATOR, clusterId % 2 === 0 ? 1 : 0);
         r = THREE.MathUtils.lerp(r, mixed.r, glow);
         g = THREE.MathUtils.lerp(g, mixed.g, glow);
         b = THREE.MathUtils.lerp(b, mixed.b, glow);
      } else if (activeFeature === 'cta') {
         // Massive golden pulse
         const pulse = Math.sin(distFromCenter - time * 10) * 0.5 + 0.5;
         if (pulse > 0.5) {
            r = COLOR_CTA.r;
            g = COLOR_CTA.g;
            b = COLOR_CTA.b;
            x += (x / distFromCenter) * pulse * 0.1;
            y += (y / distFromCenter) * pulse * 0.1;
            z += (z / distFromCenter) * pulse * 0.1;
         }
      }

      displayColors[i * 3] = r;
      displayColors[i * 3 + 1] = g;
      displayColors[i * 3 + 2] = b;

      // Idle Breathing
      if (activeFeature !== 'auth' && activeFeature !== 'cta') {
         x += velocity[i * 3];
         y += velocity[i * 3 + 1];
         z += velocity[i * 3 + 2];

         if (Math.abs(x - origX) > 0.5) velocity[i * 3] *= -1;
         if (Math.abs(y - origY) > 0.5) velocity[i * 3 + 1] *= -1;
         if (Math.abs(z - origZ) > 0.5) velocity[i * 3 + 2] *= -1;
         
         x += (origX - x) * 0.05;
         y += (origY - y) * 0.05;
         z += (origZ - z) * 0.05;
      }

      positionsAttr.setXYZ(i, x, y, z);

      // Lines
      for (let j = i + 1; j < activeNodesCount; j++) {
        const x2 = positionsAttr.getX(j);
        const y2 = positionsAttr.getY(j);
        const z2 = positionsAttr.getZ(j);

        const dX = x - x2;
        const dY = y - y2;
        const dZ = z - z2;
        const dist = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
        
        let localConnDist = CONNECTION_DISTANCE;
        if (activeFeature === 'auth') localConnDist = CONNECTION_DISTANCE * 1.2;
        if (activeFeature === 'communities' && (i >= BASE_PARTICLE_COUNT || j >= BASE_PARTICLE_COUNT)) localConnDist = CONNECTION_DISTANCE * 1.5;

        if (dist < localConnDist && lineCount < maxLines) {
          const alpha = 1.0 - (dist / localConnDist);
          
          linePositions[lineCount * 6] = x;
          linePositions[lineCount * 6 + 1] = y;
          linePositions[lineCount * 6 + 2] = z;
          linePositions[lineCount * 6 + 3] = x2;
          linePositions[lineCount * 6 + 4] = y2;
          linePositions[lineCount * 6 + 5] = z2;

          lineColors[lineCount * 6] = r * alpha;
          lineColors[lineCount * 6 + 1] = g * alpha;
          lineColors[lineCount * 6 + 2] = b * alpha;
          
          // Get j's color (approximate using base array to save a lookup for now)
          const jR = displayColors[j * 3] || baseColors[j*3];
          const jG = displayColors[j * 3 + 1] || baseColors[j*3+1];
          const jB = displayColors[j * 3 + 2] || baseColors[j*3+2];

          lineColors[lineCount * 6 + 3] = jR * alpha;
          lineColors[lineCount * 6 + 4] = jG * alpha;
          lineColors[lineCount * 6 + 5] = jB * alpha;

          lineCount++;
        }
      }
    }

    // Set colors attribute
    for(let i=0; i<activeNodesCount*3; i++) {
        colorsAttr.array[i] = displayColors[i];
    }
    // Hide inactive nodes
    for(let i=activeNodesCount*3; i<PARTICLE_COUNT*3; i++) {
        colorsAttr.array[i] = 0; 
        positionsAttr.setXYZ(Math.floor(i/3), 0,0,0);
    }

    positionsAttr.needsUpdate = true;
    colorsAttr.needsUpdate = true;
    
    const linesAttr = linesRef.current.geometry.attributes.position;
    const colorAttr = linesRef.current.geometry.attributes.color;
    
    for(let i=0; i<lineCount * 6; i++) {
        linesAttr.array[i] = linePositions[i];
        colorAttr.array[i] = lineColors[i];
    }
    
    linesRef.current.geometry.setDrawRange(0, lineCount * 2);
    linesAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={ringRef} scale={0.01}>
         <torusGeometry args={[SPHERE_RADIUS + 0.8, 0.05, 16, 100]} />
         <meshBasicMaterial color={COLOR_AUTH} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[new Float32Array(PARTICLE_COUNT * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

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
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function LivingSphere() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#F59E0B]/5 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#0A0A0A", 5, 15]} />
        <SphereNodes />
      </Canvas>
    </div>
  );
}
