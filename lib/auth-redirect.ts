const DEFAULT_PATH = "/dashboard";

export function sanitizeReturnPath(path: string | null, fallback = DEFAULT_PATH): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

export const DEFAULT_APP_PATH = DEFAULT_PATH;
export const SIGNUP_REDIRECT_PATH = "/upload";
