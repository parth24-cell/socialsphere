"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaGalleryProps {
  images: { url: string }[];
}

export function MediaGallery({ images }: MediaGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    const el = document.getElementById(`carousel-${images[0].url}`);
    if (el) {
      el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="relative mt-4">
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/60 p-2.5 hover:text-white hover:bg-white/5 rounded-full transition-all bg-black/40 border border-white/10"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Fullscreen Preview"
                fill
                className="object-contain"
                sizes="(max-w-768px) 100vw, 80vw"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid / Carousel View */}
      <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 group shadow-lg">
        {images.length === 1 ? (
          <div
            className="relative flex justify-center overflow-hidden cursor-zoom-in aspect-auto max-h-[500px]"
            onClick={() => setLightboxImage(images[0].url)}
          >
            <img
              src={images[0].url}
              alt="Attached Media"
              className="block w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 p-2 bg-black/40 border border-white/10 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm pointer-events-none">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            <div
              id={`carousel-${images[0].url}`}
              className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none items-center scrollbar-hide"
              onScroll={handleScroll}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className="w-full shrink-0 snap-center flex justify-center items-center cursor-zoom-in relative aspect-[16/10]"
                  onClick={() => setLightboxImage(img.url)}
                >
                  <img
                    src={img.url}
                    alt={`Attached Media ${i + 1}`}
                    className="block w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo(currentIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 text-white border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {currentIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo(currentIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 text-white border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentIndex ? "bg-amber-500 scale-125" : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
