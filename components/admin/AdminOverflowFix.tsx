"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ADMIN_PREFIXES = ["/pb-console", "/admin"];

/**
 * Belt-and-suspenders alongside the `.table-wrap`/`.collection-list .table` fix in
 * globals.css: this clips our own outer document's x-overflow on admin routes so
 * nothing else nested under Payload's admin UI (which renders its own <html>/<body>
 * inside this project's shared root layout) can ever cause the whole page to scroll
 * sideways, even if some other wide element shows up later.
 */
export default function AdminOverflowFix() {
  const pathname = usePathname();
  const isAdminRoute = ADMIN_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  useEffect(() => {
    if (!isAdminRoute) return;
    const previousHtmlOverflowX = document.documentElement.style.overflowX;
    const previousBodyOverflowX = document.body.style.overflowX;
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = previousHtmlOverflowX;
      document.body.style.overflowX = previousBodyOverflowX;
    };
  }, [isAdminRoute]);

  return null;
}
