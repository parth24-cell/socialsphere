"use client";

import { toggleLike, addComment, toggleBookmark, deletePost, editPost, uploadMedia } from "@/actions/post";
import { Heart, MessageCircle, Share2, Repeat2, Bookmark, MoreHorizontal, Trash, Edit, X, Check, ImagePlus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PostCardProps = {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    author: { id: string; profile?: { username: string; displayName: string | null; avatarUrl?: string | null } | null };
    images: { url: string }[];
    _count: { likes: number; comments: number };
    likes: { userId: string }[];
    bookmarks: { userId: string }[];
  };
  currentUserId: string;
};

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes?.some((l) => l.userId === currentUserId) || false);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarks?.some((b) => b.userId === currentUserId) || false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImages, setEditImages] = useState(post.images.map(img => img.url));
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const isAuthor = post.author.id === currentUserId;

  const handleLike = async () => {
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    await toggleLike(post.id);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    await addComment(post.id, commentContent);
    setCommentContent("");
    setShowComments(false);
    // Ideally we would fetch the new comments, but we rely on revalidatePath for now
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    await toggleBookmark(post.id);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      try {
        await deletePost(post.id);
        toast.success("Post deleted");
      } catch (e) {
        toast.error("Failed to delete post");
        setIsDeleting(false);
      }
    }
  };

  const handleEditSave = async () => {
    if (!editContent.trim() && editImages.length === 0 && newFiles.length === 0) return;
    setIsSaving(true);
    try {
      let finalImages = [...editImages];
      
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((f) => formData.append("files", f));
        const uploadedUrls = await uploadMedia(formData);
        finalImages = [...finalImages, ...uploadedUrls];
      }

      await editPost(post.id, editContent, finalImages);
      setIsEditing(false);
      setNewFiles([]);
      setEditImages(finalImages);
      toast.success("Post updated");
    } catch (e) {
      toast.error("Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  if (isDeleting) return null;

  return (
    <>
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative w-full h-full flex justify-center items-center">
            <Image 
              src={lightboxImage} 
              alt="Fullscreen" 
              width={2000} 
              height={2000} 
              className="max-w-full max-h-full object-contain" 
              unoptimized
            />
            <button 
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors bg-black/50"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/${post.author.profile?.username || "unknown"}`} className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-300 dark:bg-zinc-700 block overflow-hidden">
          {post.author.profile?.avatarUrl ? (
            <img
                src={post.author.profile.avatarUrl}
                alt={post.author.profile.displayName || "Avatar"}
                className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
              {post.author.profile?.username?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </Link>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={`/${post.author.profile?.username || "unknown"}`} className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline truncate">
                {post.author.profile?.displayName || post.author.profile?.username || "Unknown"}
              </Link>
              <Link href={`/${post.author.profile?.username || "unknown"}`} className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                @{post.author.profile?.username || "unknown"}
              </Link>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm">·</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm shrink-0">
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
              </span>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition outline-none">
                  <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="mt-2 flex flex-col gap-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={isSaving}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-sm outline-none focus:border-indigo-500 resize-none min-h-[80px]"
              />
              
              {/* Image Previews */}
              {(editImages.length > 0 || newFiles.length > 0) && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {editImages.map((url, i) => (
                    <div key={`existing-${i}`} className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex justify-center h-40 border border-zinc-200 dark:border-zinc-800">
                      <Image src={url} alt="Attached" width={400} height={400} className="w-full h-full object-contain" unoptimized />
                      <button 
                        onClick={() => setEditImages(prev => prev.filter(u => u !== url))}
                        disabled={isSaving}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {newFiles.map((file, i) => (
                    <div key={`new-${i}`} className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex justify-center h-40 border border-zinc-200 dark:border-zinc-800">
                      <img src={URL.createObjectURL(file)} alt="Attached" className="w-full h-full object-contain" />
                      <button 
                        onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
                        disabled={isSaving}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 justify-between items-center mt-1">
                <label className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer transition">
                  <ImagePlus className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                    disabled={isSaving}
                  />
                </label>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setIsEditing(false);
                    setEditImages(post.images.map(img => img.url));
                    setNewFiles([]);
                  }} disabled={isSaving} className="px-3 py-1.5 text-sm rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium disabled:opacity-50">Cancel</button>
                  <button onClick={handleEditSave} disabled={isSaving} className="px-3 py-1.5 text-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-medium flex items-center disabled:opacity-50">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words text-[15px]">
              {post.content}
            </p>
          )}

          {/* Media */}
          {post.images.length > 0 && (
            <div className="mt-3">
              {post.images.length === 1 ? (
                <div 
                  className="relative flex justify-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer w-full"
                  onClick={() => setLightboxImage(post.images[0].url)}
                >
                  <img 
                    src={post.images[0].url} 
                    alt="Post image" 
                    className="block w-auto h-auto max-w-full max-h-[350px] sm:max-h-[400px] object-contain"
                  />
                </div>
              ) : (
                <PostCarousel images={post.images.map(img => img.url)} onImageClick={(url) => setLightboxImage(url)} />
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between mt-4 text-zinc-500 dark:text-zinc-400 max-w-md">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-indigo-500 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm">{post._count.comments}</span>
            </button>
            
            <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-sm">0</span>
            </button>

            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20">
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-600' : ''}`} />
              </div>
              <span className="text-sm">{likesCount}</span>
            </button>

            <button 
              onClick={handleBookmark}
              className={`flex items-center gap-2 hover:text-indigo-500 transition-colors group ${isBookmarked ? 'text-indigo-600' : ''}`}
            >
              <div className="p-2 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
              </div>
            </button>
          </div>

          {/* Inline Comment Box */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Post your reply"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800 rounded-full px-4 py-2 text-sm outline-none border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
                >
                  Reply
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function PostCarousel({ images, onImageClick }: { images: string[], onImageClick: (url: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    const el = document.getElementById(`carousel-${images[0]}`); // unique id via first image
    if (el) {
      el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group w-full flex justify-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <div 
        id={`carousel-${images[0]}`}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar items-center"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, i) => (
          <div 
            key={i} 
            className="w-full shrink-0 snap-center flex justify-center items-center cursor-pointer"
            onClick={() => onImageClick(img)}
          >
            <img 
              src={img} 
              alt={`Post image ${i + 1}`} 
              className="block w-auto h-auto max-w-full max-h-[350px] sm:max-h-[400px] object-contain" 
            />
          </div>
        ))}
      </div>
      
      {currentIndex > 0 && (
        <button
          onClick={() => scrollTo(currentIndex - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition disabled:opacity-0 hover:bg-black/70"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      
      {currentIndex < images.length - 1 && (
        <button
          onClick={() => scrollTo(currentIndex + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition disabled:opacity-0 hover:bg-black/70"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? "bg-white" : "bg-white/50"}`} 
          />
        ))}
      </div>
    </div>
  );
}
