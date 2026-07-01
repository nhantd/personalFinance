import { ImageResponse } from "next/og";
import { COLORS } from "@/lib/colors";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.darkGreen,
          borderRadius: 36,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.white,
          }}
        >
          M
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: COLORS.mint,
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
