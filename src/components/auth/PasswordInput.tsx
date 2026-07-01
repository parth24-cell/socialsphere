"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showStrength = false, value = "", onChange, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // Calculate strength based on length and characters
    const calculateStrength = (val: string) => {
      let score = 0;
      if (!val) return 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      return Math.min(score, 4); // Max score is 4
    };

    const stringValue = typeof value === "string" ? value : "";
    const strength = calculateStrength(stringValue);

    const getStrengthColor = (level: number) => {
      if (level === 0) return "bg-white/10";
      if (strength >= level) {
        if (strength <= 1) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
        if (strength === 2) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
        if (strength === 3) return "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]";
        if (strength >= 4) return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]";
      }
      return "bg-white/10";
    };

    return (
      <div className="space-y-1.5 w-full">
        <label className="block text-sm font-medium text-white/80 ml-1">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            className={`
              w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30
              focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:bg-white/[0.05]
              transition-all duration-300 shadow-inner pr-12
              ${error ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""}
              ${className}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 transition-transform group-hover:scale-110" />
            ) : (
              <Eye className="w-5 h-5 transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-400 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        {/* Strength Meter */}
        {showStrength && stringValue.length > 0 && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-1">
            <div className="flex gap-1.5 h-1.5 w-full">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`flex-1 rounded-full transition-all duration-500 ${getStrengthColor(level)}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-white/50 mt-1.5 text-right font-medium tracking-wide uppercase">
              {strength <= 1 && "Weak"}
              {strength === 2 && "Fair"}
              {strength === 3 && "Good"}
              {strength >= 4 && "Strong"}
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
