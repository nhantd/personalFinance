import { renderMonaeMarkSvg } from "@/lib/brand/mark-paths";

export const size = { width: 32, height: 32 };
export const contentType = "image/svg+xml";

export default function Icon() {
  return new Response(renderMonaeMarkSvg({ variant: "default", size: 32 }), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
