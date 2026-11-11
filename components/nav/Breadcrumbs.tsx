import React from "react";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  Tag,
  ChevronRight,
  Calculator,
  Award,
  BookOpen,
  User,
  Mail,
  HelpCircle,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  theme?: "light" | "dark";
}

/**
 * Intelligent icon resolver matching the breadcrumb hierarchy:
 * Home -> Products (ShoppingCart) -> Category / Item (Tag), plus contextual fallbacks.
 */
function getAutoIcon(
  item: BreadcrumbItem,
  index: number
): LucideIcon | React.ComponentType<{ className?: string }> {
  if (item.icon) return item.icon;

  const label = item.label.toLowerCase().trim();
  const href = (item.href || "").toLowerCase().trim();

  // Root / Home
  if (index === 0 || label === "home" || href === "/" || href === "") {
    return Home;
  }

  // Shop / Catalog / Products / Store
  if (
    label.includes("product") ||
    label.includes("shop") ||
    label.includes("catalog") ||
    label.includes("store") ||
    href.includes("/shop") ||
    href.includes("/products")
  ) {
    return ShoppingCart;
  }

  // Calculator
  if (label.includes("calculator") || href.includes("/calculator")) {
    return Calculator;
  }

  // Certificates / Quality / COA
  if (
    label.includes("certificate") ||
    label.includes("coa") ||
    label.includes("quality") ||
    href.includes("/certificate")
  ) {
    return Award;
  }

  // Blog / Research / Articles
  if (
    label.includes("blog") ||
    label.includes("article") ||
    label.includes("research") ||
    label.includes("guide") ||
    href.includes("/blog")
  ) {
    return BookOpen;
  }

  // Account / Orders / Profile
  if (
    label.includes("account") ||
    label.includes("order") ||
    label.includes("profile") ||
    href.includes("/account")
  ) {
    return User;
  }

  // Contact
  if (label.includes("contact") || href.includes("/contact")) {
    return Mail;
  }

  // FAQ / Help
  if (label.includes("faq") || label.includes("help") || href.includes("/faq")) {
    return HelpCircle;
  }

  // Legal / Compliance / Terms
  if (
    label.includes("privacy") ||
    label.includes("terms") ||
    label.includes("compliance") ||
    label.includes("military")
  ) {
    return ShieldCheck;
  }

  // Default category/leaf tag (matches the Tag icon in design spec)
  return Tag;
}

/**
 * Universal Amino Based Breadcrumb Navigation Component.
 * Emits semantic HTML (<nav>, <ol>, <li>) with full accessibility (aria-label, aria-current).
 * Features clean iconography and chevron separators matching the modern UI design.
 */
export default function Breadcrumbs({
  items,
  className = "",
  theme = "light",
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const isDark = theme === "dark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-flex items-center text-xs sm:text-[13px] ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = getAutoIcon(item, index);

          return (
            <li key={index} className="inline-flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <ChevronRight
                  className={`w-3.5 h-3.5 stroke-[1.75] select-none shrink-0 ${
                    isDark ? "text-white/35" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
              )}

              {isLast || !item.href ? (
                <span
                  className={`inline-flex items-center gap-1.5 truncate max-w-[260px] sm:max-w-none ${
                    isDark ? "text-white font-medium" : "text-[#0F172A] font-medium"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75] shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 transition-colors truncate max-w-[180px] sm:max-w-none ${
                    isDark
                      ? "text-white/60 hover:text-white"
                      : "text-slate-500 hover:text-[#0F172A]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75] shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
