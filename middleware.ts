import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",  // or wherever your custom sign-in page lives
  },
});

// optionally limit to just your protected routes:
export const config = {
  matcher: ["/note-ui/:path*"],
};