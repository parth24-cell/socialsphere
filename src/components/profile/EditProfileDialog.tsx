"use client";

import React, { useState, useEffect } from "react";
import { X, Camera, Loader2, User, Globe, Shield, Sparkles, Check } from "lucide-react";
import { uploadMedia } from "@/actions/post";
import { updateProfile } from "@/actions/profile";
import { updateUserSettings, getUserSettings } from "@/actions/settings";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type ProfileData = {
  username: string;
  displayName: string;
  bio: string | null;
  website: string | null;
  location: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
};

type EditProfileDialogProps = {
  profile: ProfileData;
  onClose: () => void;
  onSuccess: () => void;
};

const INTEREST_TAGS = ["Tech", "Design", "Music", "Art", "Business", "Fitness", "Travel", "Writing", "Crypto", "Gaming"];

export function EditProfileDialog({
  profile,
  onClose,
  onSuccess
}: EditProfileDialogProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

  // Settings state (Privacy)
  const [privacyLevel, setPrivacyLevel] = useState("PUBLIC");
  // Simulated Interests tags
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    // Load current privacy settings
    const loadSettings = async () => {
      try {
        const settings = await getUserSettings();
        if (settings) {
          setPrivacyLevel(settings.privacyLevel || "PUBLIC");
        }
      } catch (err) {
        console.error("Failed to load privacy settings", err);
      }
    };

    // Load mock interests from localStorage to make it persist clientside
    const savedInts = localStorage.getItem(`interests_${profile.username}`);
    if (savedInts) {
      try {
        setSelectedInterests(JSON.parse(savedInts));
      } catch (e) {}
    }

    loadSettings();
  }, [profile.username]);

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

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(t => t !== interest) : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalAvatarUrl = profile.avatarUrl;
      let finalCoverUrl = profile.coverUrl;

      // Upload files if updated
      if (avatarFile) {
        const fd = new FormData();
        fd.append("files", avatarFile);
        const urls = await uploadMedia(fd);
        if (urls[0]) finalAvatarUrl = urls[0];
      }

      if (coverFile) {
        const fd = new FormData();
        fd.append("files", coverFile);
        const urls = await uploadMedia(fd);
        if (urls[0]) finalCoverUrl = urls[0];
      }

      // Update Profile Details
      await updateProfile({
        ...formData,
        avatarUrl: finalAvatarUrl || undefined,
        coverUrl: finalCoverUrl || undefined,
      });

      // Update Privacy Settings
      await updateUserSettings({
        privacyLevel
      });

      // Save simulated interests tags to localStorage
      localStorage.setItem(`interests_${formData.username || profile.username}`, JSON.stringify(selectedInterests));

      toast.success("Profile updated successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Basic Info", icon: User },
    { num: 2, label: "Media Details", icon: Camera },
    { num: 3, label: "Bio & Links", icon: Globe },
    { num: 4, label: "Privacy & Interests", icon: Shield },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-zinc-900/80 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div>
            <h3 className="font-bold text-white text-lg font-heading">Edit Profile</h3>
            <p className="text-xs text-white/40 mt-0.5">Customize your personal Space</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 border border-white/10 rounded-xl transition text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper progress indicator */}
        <div className="flex px-6 py-4 justify-between border-b border-white/5 bg-white/[0.005]">
          {steps.map(s => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <div 
                key={s.num} 
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => setStep(s.num)}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition border ${
                  isCompleted 
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                    : isActive 
                      ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                      : "bg-white/5 border-white/10 text-white/30"
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:inline ${
                  isActive ? "text-white" : "text-white/30"
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-2">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. janesmith"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                />
                <p className="text-[10px] text-white/30 mt-1.5">You can only change your username once every 30 days.</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Smith"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-2.5">Cover Banner</label>
                <div className="relative w-full h-36 bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
                  {coverPreview && (
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                    <Camera className="w-8 h-8 text-white/80" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "cover")} />
                  </label>
                </div>
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-2.5">Avatar Image</label>
                <div className="relative w-24 h-24 border-2 border-white/10 rounded-2xl bg-white/5 overflow-hidden group">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/20">
                      {formData.displayName?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                    <Camera className="w-6 h-6 text-white/80" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "avatar")} />
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-2">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Tell others about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-2">Website Link</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Privacy settings */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 font-bold mb-3">Privacy Profile Level</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrivacyLevel("PUBLIC")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      privacyLevel === "PUBLIC" 
                        ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    <span className="block font-bold text-xs uppercase">Public</span>
                    <span className="block text-[9px] opacity-60 mt-0.5">Anyone can see posts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrivacyLevel("PRIVATE")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      privacyLevel === "PRIVATE" 
                        ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    <span className="block font-bold text-xs uppercase">Private</span>
                    <span className="block text-[9px] opacity-60 mt-0.5">Only followers see posts</span>
                  </button>
                </div>
              </div>

              {/* Interests tag selection */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <label className="block text-xs uppercase tracking-wider text-white/40 font-bold">Interests Tags</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TAGS.map(tag => {
                    const selected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleInterestToggle(tag)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                          selected 
                            ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold" 
                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
          <button
            type="button"
            disabled={step === 1 || loading}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold transition active:scale-95"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSave}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
