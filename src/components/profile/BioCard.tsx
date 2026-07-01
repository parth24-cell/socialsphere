import React from "react";
import Link from "next/link";

type BioCardProps = {
  bio: string | null;
};

export function BioCard({ bio }: BioCardProps) {
  if (!bio) return null;

  // Render text and dynamically highlight hashtags (#tag) and mentions (@username)
  const formatBio = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, idx) => {
      if (part.startsWith("#") && part.length > 1) {
        return (
          <Link 
            key={idx} 
            href={`/search?q=${encodeURIComponent(part)}`} 
            className="text-amber-500 hover:underline font-semibold"
          >
            {part}
          </Link>
        );
      }
      if (part.startsWith("@") && part.length > 1) {
        const cleanUsername = part.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").substring(1);
        return (
          <Link 
            key={idx} 
            href={`/${cleanUsername}`} 
            className="text-amber-500 hover:underline font-semibold"
          >
            {part}
          </Link>
        );
      }
      if (part.match(/^https?:\/\//)) {
        return (
          <a 
            key={idx} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-amber-500 hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="px-6 py-1 select-text leading-relaxed text-sm text-white/80 max-w-xl whitespace-pre-wrap">
      {formatBio(bio)}
    </div>
  );
}
