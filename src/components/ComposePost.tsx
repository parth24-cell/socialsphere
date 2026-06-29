"use client";

import { useState } from "react";
import { uploadMedia, createPost } from "@/actions/post";
import { Image as ImageIcon, Loader2, X } from "lucide-react";

export default function ComposePost() {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (error) {
      console.error("Failed to create post:", error);
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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full bg-transparent resize-none outline-none text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500"
          placeholder="What's happening?"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
        
        {files.length > 0 && (
          <div className="flex gap-2 my-2 overflow-x-auto pb-2">
            {files.map((file, i) => (
              <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  disabled={isSubmitting}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition disabled:opacity-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <label className="cursor-pointer text-indigo-500 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
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
            className="bg-indigo-600 text-white px-5 py-1.5 rounded-full font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
