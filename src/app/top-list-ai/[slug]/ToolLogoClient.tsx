"use client";

import { useState } from "react";

interface ToolLogoClientProps {
  logoUrl: string;
  name: string;
  colorClass: string;
}

export function ToolLogoClient({ logoUrl, name, colorClass }: ToolLogoClientProps) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return (
      <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <span className="text-2xl font-bold text-white">{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

interface RelatedLogoProps {
  logoUrl: string;
  name: string;
  colorClass: string;
}

export function RelatedLogoClient({ logoUrl, name, colorClass }: RelatedLogoProps) {
  const [failed, setFailed] = useState(false);
  if (!logoUrl || failed) {
    return (
      <div className={`w-full h-full rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <span className="text-sm font-bold text-white">{name.charAt(0)}</span>
      </div>
    );
  }
  return (
    <img
      src={logoUrl}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
