"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
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
           <div className="flex-1 w-full flex justify-center md:justify-start">
             {children}
           </div>
         )}

         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           viewport={{ margin: "-20%" }}
           className={`flex-1 flex flex-col ${align === "left" ? "md:items-start" : "md:items-end md:text-right"}`}
         >
           <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-6 drop-shadow-xl leading-tight">
             {title}
           </h2>
           <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-lg">
             {description}
           </p>
         </motion.div>

         {align === "right" && (
           <div className="flex-1 w-full flex justify-center md:justify-end">
             {children}
           </div>
         )}
      </div>
    </div>
  );
}
