"use client";

import { useState } from "react";

function initials(name: string | undefined) {
  if (!name) return "S";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function StudentAvatar({
  name,
  photoUrl,
  size = 48,
  ring = false,
}: {
  name?: string;
  photoUrl?: string | null;
  size?: number;
  ring?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const showPhoto = photoUrl && !errored;

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-gold to-gold-dark font-display font-bold text-navy ${
        ring ? "ring-2 ring-white/30" : ""
      }`}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote R2 domain isn't known at build time
        <img
          src={photoUrl}
          alt={name || "Student photo"}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
