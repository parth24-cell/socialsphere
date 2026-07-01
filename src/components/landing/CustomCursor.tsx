"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<"text" | "interactive" | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for links, buttons, or custom interactive elements
      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer');
      
      // Check for typography elements for text cursor
      const isText = target.closest('p, h1, h2, h3, h4, h5, h6, span, div.text-content');

      if (isInteractive) {
        setIsHovering(true);
        setHoverType("interactive");
      } else if (isText && window.getSelection()?.toString() === '') {
         // Optionally change cursor on text if desired, but default is fine
        setIsHovering(true);
        setHoverType("text");
      } else {
        setIsHovering(false);
        setHoverType(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", updateHoverState);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", updateHoverState);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === "undefined") return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0
      }}
    >
      <motion.div
        className="rounded-full bg-white flex items-center justify-center"
        initial={{ width: 16, height: 16 }}
        animate={{
          width: isHovering && hoverType === "interactive" ? 48 : isHovering && hoverType === "text" ? 4 : 16,
          height: isHovering && hoverType === "interactive" ? 48 : isHovering && hoverType === "text" ? 32 : 16,
          opacity: isHovering && hoverType === "interactive" ? 0.3 : 1,
          borderRadius: isHovering && hoverType === "text" ? "2px" : "50%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </motion.div>
  );
}
