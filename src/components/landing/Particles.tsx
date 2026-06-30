"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 0,
            x: `${p.x}vw`,
            y: `${p.y + 20}vh`,
          }}
          animate={{
            opacity: [0, 0.5, 0.8, 0.5, 0],
            x: `${p.x + (Math.random() * 10 - 5)}vw`,
            y: `${p.y - (Math.random() * 20 + 10)}vh`,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute rounded-full bg-[#ffe6b4]"
          style={{
            width: p.size,
            height: p.size,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}
