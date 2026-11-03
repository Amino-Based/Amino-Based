"use client";

import React from "react";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = ["/account", "/pb-console", "/admin"];

export default function HeaderVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;
  return <>{children}</>;
}
