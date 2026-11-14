"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  CLARITY_MASK_ATTRIBUTE,
  isClarityExcludedRoute,
  shouldLoadClarity,
} from "@/lib/analytics/clarity";

/**
 * Microsoft Clarity, restricted to the canonical production host and kept away
 * from pages that render customer data.
 *
 * Two mechanisms, deliberately separated because only one of them works after
 * the recorder has started:
 *
 *   1. INJECTION GATE (reliable). The script is only ever added when a project
 *      id is set, the hostname is the canonical production domain, and the
 *      entry route is not sensitive. No script means no recording, so a visitor
 *      landing directly on /checkout is never recorded at all.
 *
 *   2. DOM MASKING (the mechanism that survives navigation). Once clarity.js
 *      has loaded it installs global observers and keeps recording; removing
 *      the <script> element or unmounting this component does NOT end the
 *      session. Rendering the script conditionally per route would therefore be
 *      a workaround that looks like protection and is not one. Instead, when
 *      the visitor navigates into a sensitive route, `data-clarity-mask` is set
 *      on <body>. Clarity reads that attribute as it serialises the DOM, so the
 *      text stays out of the recording continuously, including content rendered
 *      after the attribute was applied.
 *
 * A best-effort `clarity("stop")` is also issued on entering a sensitive route.
 * Masking is what this relies on; the stop call is additional and its behaviour
 * has NOT been verified against a live Clarity session, so it is not treated as
 * protection.
 *
 * Renders no markup.
 */

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
    /** Set once the tag has been requested, so a remount cannot inject twice. */
    __aminoClarityInitialised?: boolean;
  }
}

export default function ClarityAnalytics({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const excluded = isClarityExcludedRoute(pathname ?? window.location.pathname);

    // --- Mask first, before anything else can be serialised on this route. ---
    // Applied and removed on every navigation so the attribute always reflects
    // the page currently on screen.
    if (excluded) {
      document.body.setAttribute(CLARITY_MASK_ATTRIBUTE, "true");
      // Best effort only; see the note above. Harmless if unsupported, since
      // the call is queued on clarity.q and ignored.
      try {
        window.clarity?.("stop");
      } catch {
        /* never let analytics break a page */
      }
    } else {
      document.body.removeAttribute(CLARITY_MASK_ATTRIBUTE);
    }

    // --- Injection gate. Runs once, and never on a sensitive entry route. ---
    if (window.__aminoClarityInitialised) return;
    if (
      !shouldLoadClarity({
        projectId,
        host: window.location.hostname,
        pathname: pathname ?? window.location.pathname,
      })
    ) {
      return;
    }

    window.__aminoClarityInitialised = true;

    // Microsoft's documented loader, with the queue stub preserved so calls
    // made before the tag arrives are not lost.
    window.clarity =
      window.clarity ||
      (function (...args: unknown[]) {
        (window.clarity!.q = window.clarity!.q || []).push(args);
      } as Window["clarity"]);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
    document.head.appendChild(script);
  }, [projectId, pathname]);

  return null;
}
