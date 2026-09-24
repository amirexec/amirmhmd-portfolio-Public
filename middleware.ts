import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  // Protects every /admin page except the login screen itself. The
  // /api/admin/* routes are deliberately NOT matched here: withAuth's
  // default behavior is to redirect unauthenticated requests to the sign-in
  // page, which would break API callers expecting a 401 JSON response.
  // Each /api/admin/* route instead checks the session itself via
  // requireAdmin() and returns a proper 401.
  matcher: ["/admin", "/admin/((?!login).*)"],
};
