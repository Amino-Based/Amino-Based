import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PRODUCT_SLUG_REDIRECTS } from "@/lib/productSlugs";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/product/")) {
    const slug = pathname.slice("/product/".length).replace(/\/+$/, "");
    const target = PRODUCT_SLUG_REDIRECTS[slug];
    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = `/product/${target}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*"],
};
