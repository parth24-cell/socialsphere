"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Loader2, X, Send } from "lucide-react";
import { uploadMedia, createPost } from "@/actions/post";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ComposerProps {
  onSuccess?: () => void;
  placeholder?: string;
}

export function Composer({ onSuccess, placeholder = "Share your thoughts..." }: ComposerProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;

    setIsSubmitting(true);
    try {
      let mediaUrls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        mediaUrls = await uploadMedia(formData);
      }

      await createPost(content, mediaUrls);

      setContent("");
      setFiles([]);
      toast.success("Post published successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:border-white/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Composer Input Area */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-lg">
            🖋️
          </div>
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent resize-none outline-none text-white placeholder:text-white/30 text-sm sm:text-base leading-relaxed min-h-[90px] pt-1.5"
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Media Previews */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-none pt-2"
            >
              {files.map((file, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 group shadow-md"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="attachment-preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    disabled={isSubmitting}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl p-1.5 transition disabled:opacity-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <label className="cursor-pointer p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all active:scale-95">
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && files.length === 0)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-white/5 text-black disabled:text-white/20 font-bold text-sm transition-all active:scale-[0.98] disabled:pointer-events-none shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
