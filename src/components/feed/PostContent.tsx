"use client";

import Link from "next/link";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  // Regex to detect hashtags (#word) and mentions (@word)
  const regex = /(\s|^)(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g;

  const parseContent = (text: string) => {
    if (!text) return "";

    const parts = [];
    let lastIndex = 0;
    let match;

    // Reset regex index
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index + match[1].length;
      const matchText = match[2];

      // Add text before the match
      if (matchIndex > lastIndex) {
        parts.push(text.slice(lastIndex, matchIndex));
      }

      // Format hashtag or mention
      if (matchText.startsWith("#")) {
        const tag = matchText.slice(1);
        parts.push(
          <Link
            key={matchIndex}
            href={`/search?q=%23${tag}`}
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            {matchText}
          </Link>
        );
      } else if (matchText.startsWith("@")) {
        const username = matchText.slice(1);
        parts.push(
          <Link
            key={matchIndex}
            href={`/${username}`}
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            {matchText}
          </Link>
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words font-normal tracking-wide">
      {parseContent(content)}
    </div>
  );
}
