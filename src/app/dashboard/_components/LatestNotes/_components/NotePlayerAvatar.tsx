"use client";

import React from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils/constants/PlaceHolderImage";

type Props = {
  imageUrl?: string | null;
  alt: string;
  /** Matches watchlist card sizes: compact preview vs full notes row. */
  size?: "sm" | "md";
};

const classBySize = {
  sm: "h-9 w-9 min-h-9 min-w-9",
  md: "h-10 w-10 min-h-10 min-w-10",
} as const;

const dim = { sm: 36, md: 40 } as const;

/**
 * Rounded player photo — same fallback image as the watchlist when no URL.
 */
export default function NotePlayerAvatar({
  imageUrl,
  alt,
  size = "sm",
}: Props) {
  const src = imageUrl?.trim() ? imageUrl.trim() : PLACEHOLDER_IMAGE;

  return (
    <Image
      src={src}
      alt={alt}
      width={dim[size]}
      height={dim[size]}
      className={`${classBySize[size]} shrink-0 rounded-full border-2 border-borderDarkPurple object-cover ring-1 ring-white/10`}
    />
  );
}
