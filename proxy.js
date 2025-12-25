import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|[\\w-]+\\.\\w+).*)"],
};

export default function proxy(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const rootDomain = "lvh.me:3000"; 

  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${rootDomain}`, "");

  if (subdomain && subdomain !== hostname) {
    // 💡 NEXT 16.1 FIX: Use absolute URL reconstruction for the rewrite
    // to prevent path-parsing errors in the new Turbopack router.
    const internalPath = `/user/${subdomain}${url.pathname}`;
    const rewriteUrl = new URL(internalPath, req.url);
    
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}