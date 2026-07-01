const DEFAULT_PATH = "/dashboard";

export function sanitizeReturnPath(path: string | null, fallback = DEFAULT_PATH): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

/** Production-safe origin for auth redirects on Vercel/server. */
export function getAppOriginFromRequest(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost.split(",")[0]?.trim()}`;
  }

  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured && !configured.includes("localhost")) {
    return configured;
  }

  return new URL(request.url).origin;
}

export function buildOAuthCallbackUrl(destination: string): string {
  const origin = window.location.origin;
  return `${origin}/auth/callback?next=${encodeURIComponent(destination)}`;
}

export const DEFAULT_APP_PATH = DEFAULT_PATH;
export const SIGNUP_REDIRECT_PATH = "/upload";
