// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// export function middleware(request: NextRequest) {
//   const jwt = request.cookies.get("JWT")

//   const publicPaths = ["/login", "/signup"]

//   const { pathname } = request.nextUrl

//   // Allow public pages
//   if (publicPaths.includes(pathname)) {
//     return NextResponse.next()
//   }

//   // Block everything else if not logged in
//   if (!jwt) {
//     return NextResponse.redirect(new URL("/login", request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/((?!_next|favicon.ico).*)"],
// }

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}