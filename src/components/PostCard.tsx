"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleLike, toggleBookmark, deletePost, editPost, uploadMedia } from "@/actions/post";
import { PostHeader } from "./feed/PostHeader";
import { PostContent } from "./feed/PostContent";
import { MediaGallery } from "./feed/MediaGallery";
import { EngagementBar } from "./feed/EngagementBar";
import { CommentSection } from "./feed/CommentSection";
import { AuthInput } from "@/components/auth/AuthInput";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PostCardProps = {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      profile?: {
        username: string;
        displayName: string | null;
        avatarUrl?: string | null;
      } | null;
    };
    images: { url: string }[];
    _count: { likes: number; comments: number };
    likes: { userId: string }[];
    bookmarks: { userId: string }[];
    comments?: any[]; // optional comments array
  };
  currentUserId: string;
};

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes?.some((l) => l.userId === currentUserId) || false);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarks?.some((b) => b.userId === currentUserId) || false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post._count.comments);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImages, setEditImages] = useState(post.images.map((img) => img.url));
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    await toggleLike(post.id);
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
    <div className="w-full border-b border-white/10 py-6 px-4 bg-transparent transition-colors hover:bg-white/[0.01]">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <PostHeader
          authorId={post.author.id}
          username={post.author.profile?.username || "unknown"}
          displayName={post.author.profile?.displayName || null}
          avatarUrl={post.author.profile?.avatarUrl}
          createdAt={post.createdAt}
          currentUserId={currentUserId}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />

        {/* Content Area */}
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={isSaving}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500 resize-none min-h-[90px]"
            />

            {/* Editing Media Previews */}
            {(editImages.length > 0 || newFiles.length > 0) && (
              <div className="grid grid-cols-3 gap-2">
                {editImages.map((url, i) => (
                  <div key={`existing-${i}`} className="relative rounded-xl overflow-hidden bg-white/5 h-24 border border-white/10">
                    <img src={url} alt="Post media" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setEditImages((prev) => prev.filter((u) => u !== url))}
                      disabled={isSaving}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {newFiles.map((file, i) => (
                  <div key={`new-${i}`} className="relative rounded-xl overflow-hidden bg-white/5 h-24 border border-white/10">
                    <img src={URL.createObjectURL(file)} alt="Attached preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      disabled={isSaving}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <label className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-all active:scale-95">
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
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditImages(post.images.map((img) => img.url));
                    setNewFiles([]);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 transition-colors"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pl-[56px] space-y-3">
            <PostContent content={post.content} />
            <MediaGallery images={post.images} />
          </div>
        )}

        {/* Action Buttons & Comments */}
        <div className="pl-[56px]">
          <EngagementBar
            postId={post.id}
            isLiked={isLiked}
            likesCount={likesCount}
            commentsCount={commentsCount}
            isBookmarked={isBookmarked}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onCommentToggle={() => setShowComments(!showComments)}
          />

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <CommentSection
                  postId={post.id}
                  comments={post.comments || []}
                  currentUserId={currentUserId}
                  onCommentAdded={() => {
                    setCommentsCount((c) => c + 1);
                    setShowComments(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
