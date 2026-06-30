import { renderMonaeMarkSvg } from "@/lib/brand/mark-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/svg+xml";

export default function AppleIcon() {
  return new Response(renderMonaeMarkSvg({ variant: "default", size: 180 }), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
