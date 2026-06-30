"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function AnimatedCounter({ value, suffix }: { value: number, suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-black text-white tracking-tighter">
      {count}{suffix}
    </div>
  );
}

const stats = [
  { label: "Active Users", value: 5, suffix: "M+" },
  { label: "Posts Created", value: 100, suffix: "M+" },
  { label: "Countries", value: 150, suffix: "+" },
  { label: "Uptime", value: 99, suffix: ".9%" }
];

export function Stats() {
  return (
    <section className="relative py-24 z-20 border-y border-white/5 bg-black/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="space-y-2"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
