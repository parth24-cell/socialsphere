"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function Spotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Use spring physics for the spotlight to make it feel smooth and cinematic
  const springConfig = { damping: 40, stiffness: 100 };
  const smoothX = useSpring(mousePosition.x, springConfig);
  const smoothY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300"
      style={{
        background: `radial-gradient(800px circle at ${smoothX.get()}px ${smoothY.get()}px, rgba(255,255,255,0.03), transparent 40%)`,
      }}
    />
  );
}
