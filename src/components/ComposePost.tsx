"use client";

import { Composer } from "@/components/feed/Composer";

interface ComposePostProps {
  onSuccess?: () => void;
}

export default function ComposePost({ onSuccess }: ComposePostProps = {}) {
  return <Composer onSuccess={onSuccess} />;
}
