import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";
import { COLORS } from "@/lib/colors";

export const alt = `${BRAND.name} — AI personal finance advisor`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: COLORS.darkGreen,
          color: COLORS.white,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              backgroundColor: COLORS.forest,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              position: "relative",
            }}
          >
            M
            <div
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: COLORS.mint,
              }}
            />
          </div>
          <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {BRAND.name}
          </div>
        </div>
        <div
          style={{
            fontSize: 40,
            lineHeight: 1.3,
            color: COLORS.mint,
            maxWidth: 900,
          }}
        >
          AI personal finance advisor
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            lineHeight: 1.4,
            color: COLORS.tealLight,
            maxWidth: 900,
          }}
        >
          Net worth, spending, and debt — from uploaded statements. No bank credentials.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
