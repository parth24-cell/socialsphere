"use client";

import { useState } from "react";
import { uploadMedia } from "@/actions/post";
import { updateProfile } from "@/actions/profile";
import { Loader2, Camera } from "lucide-react";
import Image from "next/image";

type SettingsFormProps = {
  profile: {
    username: string;
    displayName: string;
    bio: string | null;
    website: string | null;
    location: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
  };
};

export default function SettingsForm({ profile }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    username: profile.username || "",
    displayName: profile.displayName || "",
    bio: profile.bio || "",
    website: profile.website || "",
    location: profile.location || "",
  });

  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const [coverPreview, setCoverPreview] = useState(profile.coverUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "avatar") {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      let avatarUrl = profile.avatarUrl;
      let coverUrl = profile.coverUrl;

      if (avatarFile) {
        const fd = new FormData();
        fd.append("files", avatarFile);
        const urls = await uploadMedia(fd);
        if (urls[0]) avatarUrl = urls[0];
      }

      if (coverFile) {
        const fd = new FormData();
        fd.append("files", coverFile);
        const urls = await uploadMedia(fd);
        if (urls[0]) coverUrl = urls[0];
      }

      await updateProfile({
        ...formData,
        avatarUrl: avatarUrl || undefined,
        coverUrl: coverUrl || undefined,
      });

      setMsg("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      setMsg(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Cover Image */}
      <div className="relative w-full h-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden group">
        {coverPreview && (
          <Image src={coverPreview} alt="Cover" fill className="object-cover" />
        )}
        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
          <Camera className="w-8 h-8 text-white" />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "cover")} />
        </label>
      </div>

      {/* Avatar Image */}
      <div className="relative w-24 h-24 -mt-16 ml-4 border-4 border-white dark:border-zinc-900 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 overflow-hidden group">
        {avatarPreview ? (
          <Image src={avatarPreview} alt="Avatar" fill className="object-cover object-center" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-400">
            {formData.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
          <Camera className="w-6 h-6 text-white" />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "avatar")} />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Username (can be changed once every 30 days)</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-50"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Display Name</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-50"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bio</label>
          <textarea
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-50"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Website</label>
          <input
            type="url"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-50"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Location</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-50"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      </div>

      {msg && <p className="text-sm font-medium text-indigo-600">{msg}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
        </button>
      </div>
    </form>
  );
}
