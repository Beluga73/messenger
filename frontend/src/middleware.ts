import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { device } = userAgent(req);
  const viewport = device.type || "desktop";

  const requestHeaders = new Headers(req.headers);
  // set header so layout.tsx can read
  requestHeaders.set("x-viewport", viewport);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
