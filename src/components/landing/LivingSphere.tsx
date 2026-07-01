"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "framer-motion";
import { useSphere } from "./SphereContext";

const SPHERE_RADIUS = 2.5; // Made smaller
const damp = THREE.MathUtils.damp;

// Premium Lighting Rig Colors
const L_BASE = new THREE.Color("#0f172a"); // Deep slate ambient
const L_MESSAGING = new THREE.Color("#8b5cf6"); // Violet
const L_STORIES = new THREE.Color("#06b6d4"); // Cyan
const L_FEED = new THREE.Color("#ffffff"); // White sharp pings
const L_COMMUNITIES = new THREE.Color("#3b82f6"); // Blue
const L_AUTH = new THREE.Color("#ffffff"); // White scanner
const L_CREATOR = new THREE.Color("#fbbf24"); // Gold
const L_AI = new THREE.Color("#ffffff"); // White
const L_CTA = new THREE.Color("#ffffff"); // White climax

function EngineeredStructure() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Lighting Refs
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const orbitalLightRef = useRef<THREE.PointLight>(null);
  const scannerLightRef = useRef<THREE.DirectionalLight>(null);
  const clusterLight1Ref = useRef<THREE.PointLight>(null);
  const clusterLight2Ref = useRef<THREE.PointLight>(null);
  
  const { scrollYProgress } = useScroll();
  const { activeFeature } = useSphere();
  const { camera, pointer } = useThree();

  // Generate Base Geometry
  const { geometry, vertexCount, vertices } = useMemo(() => {
    // Icosahedron with detail level 4 gives a highly structured, symmetrical geodesic dome
    const geo = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 4);
    
    // Extract unique vertices for the nodes
    const posAttr = geo.attributes.position;
    const uniqueVertices: THREE.Vector3[] = [];
    const hashSet = new Set<string>();
    
    for (let i = 0; i < posAttr.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      const hash = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
      if (!hashSet.has(hash)) {
        hashSet.add(hash);
        uniqueVertices.push(v);
      }
    }
    
    return { geometry: geo, vertexCount: uniqueVertices.length, vertices: uniqueVertices };
  }, []);

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize nodes
  useMemo(() => {
    if (!instancedMeshRef.current) return;
    for (let i = 0; i < vertexCount; i++) {
      dummy.position.copy(vertices[i]);
      // Make some nodes slightly larger to add structural hierarchy without randomness
      const isMajor = i % 10 === 0; 
      dummy.scale.setScalar(isMajor ? 1.5 : 1.0);
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [vertexCount, vertices, dummy]);

  // Premium Physical Material shared by both wireframe and nodes
  const premiumMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#fef3c7", // Amber 50 - Bright warm node color
    emissive: "#b45309", // Amber 700 - Warm orangish inner glow
    roughness: 0.1, // Glass/Metal finish
    metalness: 0.8, // Highly reflective
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 1.0,
  }), []);

  const wireframeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#f59e0b", // Amber 500 - Solid orangish wireframe
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.85, // Highly visible lines
  }), []);

  // Light targets for dampening
  const targetCoreColor = useMemo(() => new THREE.Color(), []);
  const targetOrbitalColor = useMemo(() => new THREE.Color(), []);
  const targetScannerColor = useMemo(() => new THREE.Color(), []);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const scrollVal = scrollYProgress.get();

    // 1. Effortless, rigid interaction
    // The structure itself never warps or breathes. It only rotates slowly and tilts smoothly.
    const targetRotX = pointer.y * 0.1 + scrollVal * 0.2;
    const targetRotY = pointer.x * 0.1 + time * 0.03; // Ultra slow base rotation
    
    groupRef.current.rotation.x = damp(groupRef.current.rotation.x, targetRotX, 2, delta);
    groupRef.current.rotation.y = damp(groupRef.current.rotation.y, targetRotY, 2, delta);
    
    camera.position.z = damp(camera.position.z, 9 - (scrollVal * 0.8), 2, delta);

    // 2. Cinematic Lighting Orchestration
    // Reset targets
    let coreIntensity = 0;
    let orbitalIntensity = 0;
    let scannerIntensity = 0;
    let clusterIntensity = 0;
    
    targetCoreColor.copy(L_BASE);
    targetOrbitalColor.copy(L_BASE);
    targetScannerColor.copy(L_BASE);

    // Orchestrate lights based on section
    if (activeFeature === 'messaging') {
        // Violet pulse from the core
        targetCoreColor.copy(L_MESSAGING);
        coreIntensity = (Math.sin(time * 3) * 0.5 + 0.5) * 5 + 2;
    } 
    else if (activeFeature === 'stories') {
        // Cyan orbital light revolving around the sphere
        targetOrbitalColor.copy(L_STORIES);
        orbitalIntensity = 8;
        if (orbitalLightRef.current) {
            orbitalLightRef.current.position.x = Math.cos(time * 2) * 5;
            orbitalLightRef.current.position.z = Math.sin(time * 2) * 5;
            orbitalLightRef.current.position.y = Math.sin(time * 1.5) * 2;
        }
    }
    else if (activeFeature === 'feed') {
        // Fast, sharp white pings (like data flashing)
        targetCoreColor.copy(L_FEED);
        coreIntensity = Math.random() > 0.9 ? 15 : 0.5; // High contrast flicker
    }
    else if (activeFeature === 'communities') {
        // Distinct blue area lights
        targetOrbitalColor.copy(L_COMMUNITIES);
        clusterIntensity = 5;
        if (clusterLight1Ref.current && clusterLight2Ref.current) {
            clusterLight1Ref.current.position.set(3, 2, 3);
            clusterLight2Ref.current.position.set(-3, -2, -3);
        }
    }
    else if (activeFeature === 'auth') {
        // White scanner plane
        targetScannerColor.copy(L_AUTH);
        scannerIntensity = 3;
        if (scannerLightRef.current) {
            // Scanner moves down the Y axis
            const scanY = Math.sin(time * 1.5) * 5;
            scannerLightRef.current.position.set(0, scanY, 5);
            scannerLightRef.current.target.position.set(0, scanY, 0);
            scannerLightRef.current.target.updateMatrixWorld();
        }
    }
    else if (activeFeature === 'creator') {
        // Warm golden core
        targetCoreColor.copy(L_CREATOR);
        coreIntensity = 8;
    }
    else if (activeFeature === 'ai') {
        // White intelligence sweep
        targetOrbitalColor.copy(L_AI);
        orbitalIntensity = 10;
        if (orbitalLightRef.current) {
            orbitalLightRef.current.position.x = Math.sin(time * 3) * 6;
            orbitalLightRef.current.position.y = 0;
            orbitalLightRef.current.position.z = 4;
        }
    }
    else if (activeFeature === 'cta') {
        // Unified climax
        targetCoreColor.copy(L_CTA);
        coreIntensity = 12;
        targetOrbitalColor.copy(L_CTA);
        orbitalIntensity = 5;
        if (orbitalLightRef.current) {
            orbitalLightRef.current.position.set(4, 4, 4);
        }
    }
    else {
        // Default Majestic Idle State (Top of page)
        targetCoreColor.copy(L_BASE);
        coreIntensity = 1; // Soft internal glow
        targetOrbitalColor.copy(new THREE.Color("#ffffff"));
        orbitalIntensity = 3; // Gentle moving highlight
        if (orbitalLightRef.current) {
            orbitalLightRef.current.position.x = Math.sin(time * 0.5) * 8;
            orbitalLightRef.current.position.y = Math.cos(time * 0.3) * 5;
            orbitalLightRef.current.position.z = Math.sin(time * 0.4) * 8;
        }
    }

    // Apply dampened lighting for smooth 1-2s transitions
    if (coreLightRef.current) {
        coreLightRef.current.color.lerp(targetCoreColor, damp(0, 1, 2, delta));
        coreLightRef.current.intensity = damp(coreLightRef.current.intensity, coreIntensity, 2, delta);
    }
    
    if (orbitalLightRef.current) {
        orbitalLightRef.current.color.lerp(targetOrbitalColor, damp(0, 1, 2, delta));
        orbitalLightRef.current.intensity = damp(orbitalLightRef.current.intensity, orbitalIntensity, 2, delta);
    }
    
    if (scannerLightRef.current) {
        scannerLightRef.current.color.lerp(targetScannerColor, damp(0, 1, 2, delta));
        scannerLightRef.current.intensity = damp(scannerLightRef.current.intensity, scannerIntensity, 2, delta);
    }
    
    if (clusterLight1Ref.current && clusterLight2Ref.current) {
        clusterLight1Ref.current.color.lerp(L_COMMUNITIES, damp(0, 1, 2, delta));
        clusterLight2Ref.current.color.lerp(L_COMMUNITIES, damp(0, 1, 2, delta));
        clusterLight1Ref.current.intensity = damp(clusterLight1Ref.current.intensity, clusterIntensity, 2, delta);
        clusterLight2Ref.current.intensity = damp(clusterLight2Ref.current.intensity, clusterIntensity, 2, delta);
    }
  });

  return (
    <group ref={groupRef}>
      {/* --- Lighting Rig --- */}
      <ambientLight ref={ambientRef} intensity={1.2} color="#fffbeb" />
      
      {/* Core internal light */}
      <pointLight ref={coreLightRef} position={[0, 0, 0]} distance={8} decay={2} />
      
      {/* Orbital moving light */}
      <pointLight ref={orbitalLightRef} distance={10} decay={2} />
      
      {/* Scanner light */}
      <directionalLight ref={scannerLightRef} position={[0, 5, 5]} />
      
      {/* Cluster lights */}
      <pointLight ref={clusterLight1Ref} distance={6} decay={2} intensity={0} />
      <pointLight ref={clusterLight2Ref} distance={6} decay={2} intensity={0} />

      {/* --- Engineered Geometry --- */}
      {/* The Solid Wireframe */}
      <mesh geometry={geometry} material={wireframeMaterial} />
      
      {/* The Vertex Nodes */}
      <instancedMesh ref={instancedMeshRef} args={[new THREE.SphereGeometry(0.02, 8, 8), premiumMaterial, vertexCount]} />
    </group>
  );
}

export function LivingSphere() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto bg-[#020205]">
      {/* Completely clean background. No noise filters, no heavy gradients. Just pure dark space. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A0A12] via-[#020205] to-[#000000] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 9], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <EngineeredStructure />
      </Canvas>
    </div>
  );
}
