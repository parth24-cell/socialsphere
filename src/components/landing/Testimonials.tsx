"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Community Manager",
    avatar: "AR",
    text: "SocialSphere completely transformed how we engage with our audience. The speed and real-time features are unmatched in the industry."
  },
  {
    name: "Samantha Wu",
    role: "Content Creator",
    avatar: "SW",
    text: "I've used every platform out there, but this feels different. It's clean, distraction-free, and respects my privacy. 10/10."
  },
  {
    name: "David K.",
    role: "Startup Founder",
    avatar: "DK",
    text: "The enterprise security combined with such a consumer-friendly UI is a rare find. It's the perfect balance for our team."
  }
];

export function Testimonials() {
  return (
    <section className="relative py-32 z-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Loved by millions.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative group perspective-1000"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex gap-1 mb-6 text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{t.name}</h4>
                  <p className="text-zinc-500 text-sm">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
