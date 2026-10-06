import { auth } from "@/auth";

export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tontines/:path*",
    "/wallet/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
