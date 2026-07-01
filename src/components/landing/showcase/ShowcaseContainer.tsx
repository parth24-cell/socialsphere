"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useSphere, ActiveFeature } from "../SphereContext";

export function ShowcaseContainer({
  featureId,
  title,
  description,
  children,
  align = "left"
}: {
  featureId: ActiveFeature;
  title: string;
  description: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-40% 0px -40% 0px" });
  const { setActiveFeature } = useSphere();

  // Scroll architecture hooks
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax for mockup (moves slightly opposite to scroll to float)
  const yParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const smoothY = useSpring(yParallax, { stiffness: 50, damping: 20 });

  // Scroll velocity for typography skewing (Apple/Stripe effect)
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Transform velocity to a subtle skew value (-3deg to 3deg max)
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [-2, 2]);

  useEffect(() => {
    if (isInView) {
      setActiveFeature(featureId);
    }
  }, [isInView, featureId, setActiveFeature]);

  return (
    <div 
      ref={containerRef} 
      id={`section-${featureId}`}
      className="min-h-[100vh] w-full flex items-center py-24 relative z-10"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24">
         
         {align === "left" && (
           <motion.div 
              style={{ y: smoothY }}
              className="flex-1 w-full flex justify-center md:justify-start perspective-1000"
           >
             {children}
           </motion.div>
         )}

         <motion.div 
           style={{ skewY: skewVelocity }}
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           viewport={{ margin: "-20%" }}
           className={`flex-1 flex flex-col origin-center relative ${align === "left" ? "md:items-start" : "md:items-end md:text-right"}`}
         >
           {/* Ambient Occlusion Mask for Text Readability */}
           <div className={`absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,rgba(2,2,5,0.6)_0%,transparent_70%)] scale-150 ${align === "left" ? "origin-left" : "origin-right"}`} />

           <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-6 drop-shadow-2xl leading-tight">
             {title}
           </h2>
           <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-lg drop-shadow-md">
             {description}
           </p>
         </motion.div>

         {align === "right" && (
           <motion.div 
              style={{ y: smoothY }}
              className="flex-1 w-full flex justify-center md:justify-end perspective-1000"
           >
             {children}
           </motion.div>
         )}
      </div>
    </div>
  );
}
