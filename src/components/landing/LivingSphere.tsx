"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScroll } from "framer-motion";

const PARTICLE_COUNT = 300;
const SPHERE_RADIUS = 3;
const CONNECTION_DISTANCE = 0.8;

function SphereNodes() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse, camera } = useThree();
  const { scrollYProgress } = useScroll();

  // Generate node positions in a sphere
  const [positions, originalPositions, colors, velocity] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);

    const baseColor = new THREE.Color("#4F46E5"); // Accent
    const highlightColor = new THREE.Color("#06B6D4"); // Highlight

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Math to distribute points spherically
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      // Give it a slightly varied radius for organic feel
      const r = SPHERE_RADIUS + (Math.random() * 0.5 - 0.25);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      // Colors
      const mixedColor = baseColor.clone().lerp(highlightColor, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      // Small velocities for the "breathing" effect
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, origPos, col, vel];
  }, []);

  // Pre-allocate geometry for lines (max possible connections is high, but we'll cap it)
  // To avoid recreating geometry every frame, we update a BufferGeometry
  const maxLines = PARTICLE_COUNT * 10;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;

    // Scroll controls the rotation and slightly the camera zoom
    const scrollVal = scrollYProgress.get();
    
    // Base rotation + scroll rotation
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x = scrollVal * Math.PI * 0.5;
    linesRef.current.rotation.y = pointsRef.current.rotation.y;
    linesRef.current.rotation.x = pointsRef.current.rotation.x;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8 - (scrollVal * 2), 0.1);

    // Mouse interaction (raycasting from camera to plane)
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    
    let lineCount = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = positionsAttr.getX(i);
      let y = positionsAttr.getY(i);
      let z = positionsAttr.getZ(i);

      // Breathing movement (drift back to original)
      const origX = originalPositions[i * 3];
      const origY = originalPositions[i * 3 + 1];
      const origZ = originalPositions[i * 3 + 2];

      x += velocity[i * 3];
      y += velocity[i * 3 + 1];
      z += velocity[i * 3 + 2];

      // Keep within bounds
      if (Math.abs(x - origX) > 0.5) velocity[i * 3] *= -1;
      if (Math.abs(y - origY) > 0.5) velocity[i * 3 + 1] *= -1;
      if (Math.abs(z - origZ) > 0.5) velocity[i * 3 + 2] *= -1;

      // Mouse interaction (subtle attraction)
      // Transform mouse world pos to local object space
      const localMouse = pos.clone().applyMatrix4(pointsRef.current.matrixWorld.clone().invert());
      
      const dx = localMouse.x - x;
      const dy = localMouse.y - y;
      const dz = localMouse.z - z;
      const distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distToMouse < 2) {
        const force = (2 - distToMouse) * 0.01;
        x += dx * force;
        y += dy * force;
        z += dz * force;
      } else {
        // Return to original
        x += (origX - x) * 0.05;
        y += (origY - y) * 0.05;
        z += (origZ - z) * 0.05;
      }

      positionsAttr.setXYZ(i, x, y, z);

      // Calculate connections
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const x2 = positionsAttr.getX(j);
        const y2 = positionsAttr.getY(j);
        const z2 = positionsAttr.getZ(j);

        const dX = x - x2;
        const dY = y - y2;
        const dZ = z - z2;
        const dist = Math.sqrt(dX * dX + dY * dY + dZ * dZ);

        if (dist < CONNECTION_DISTANCE && lineCount < maxLines) {
          const alpha = 1.0 - (dist / CONNECTION_DISTANCE);
          
          linePositions[lineCount * 6] = x;
          linePositions[lineCount * 6 + 1] = y;
          linePositions[lineCount * 6 + 2] = z;
          linePositions[lineCount * 6 + 3] = x2;
          linePositions[lineCount * 6 + 4] = y2;
          linePositions[lineCount * 6 + 5] = z2;

          // Start color
          lineColors[lineCount * 6] = colors[i * 3] * alpha;
          lineColors[lineCount * 6 + 1] = colors[i * 3 + 1] * alpha;
          lineColors[lineCount * 6 + 2] = colors[i * 3 + 2] * alpha;
          
          // End color
          lineColors[lineCount * 6 + 3] = colors[j * 3] * alpha;
          lineColors[lineCount * 6 + 4] = colors[j * 3 + 1] * alpha;
          lineColors[lineCount * 6 + 5] = colors[j * 3 + 2] * alpha;

          lineCount++;
        }
      }
    }

    positionsAttr.needsUpdate = true;
    
    const linesAttr = linesRef.current.geometry.attributes.position;
    const colorAttr = linesRef.current.geometry.attributes.color;
    
    // Update lines buffer
    for(let i=0; i<lineCount * 6; i++) {
        linesAttr.array[i] = linePositions[i];
        colorAttr.array[i] = lineColors[i];
    }
    // Clear the rest
    for(let i=lineCount * 6; i<maxLines * 6; i++) {
        linesAttr.array[i] = 0;
        colorAttr.array[i] = 0;
    }
    
    linesRef.current.geometry.setDrawRange(0, lineCount * 2);
    linesAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
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
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function LivingSphere() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto bg-[#030014]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4F46E5]/10 via-[#030014] to-[#030014] pointer-events-none" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#030014", 5, 15]} />
        <SphereNodes />
      </Canvas>
    </div>
  );
}
