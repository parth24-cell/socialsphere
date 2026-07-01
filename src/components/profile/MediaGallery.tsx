"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Eye, X } from "lucide-react";
import { EmptyState } from "./EmptyState";

type MediaItem = {
  id: string;
  url: string;
  postId: string;
};

type MediaGalleryProps = {
  posts: any[];
};

export function MediaGallery({ posts }: MediaGalleryProps) {
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);

  // Extract all media images from the posts
  const mediaItems: MediaItem[] = posts
    .filter((post) => !post.deletedAt)
    .flatMap((post) => 
      (post.images || []).map((img: any) => ({
        id: img.id || Math.random().toString(),
        url: img.url,
        postId: post.id
      }))
    );

  if (mediaItems.length === 0) {
    return (
      <div className="py-8 px-6">
        <EmptyState
          title="No media shared"
          description="This user has not posted any pictures or files yet."
          icon={<ImageIcon className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-6 pb-8 pt-4 select-none">
      <div className="grid grid-cols-3 gap-2">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPreviewUrl(item.url)}
            className="aspect-square bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden cursor-zoom-in relative group hover:border-amber-500/20 transition-all duration-300"
          >
            <img
              src={item.url}
              alt="Shared media"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* View overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPreviewUrl && (
        <div 
          onClick={() => setSelectedPreviewUrl(null)}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[999] cursor-zoom-out animate-in fade-in duration-300"
        >
          <img 
            src={selectedPreviewUrl} 
            alt="Lightbox preview" 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
          />
          <button
            onClick={() => setSelectedPreviewUrl(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/10 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
