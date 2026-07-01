import { ImageResponse } from "next/og";
import { COLORS } from "@/lib/colors";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.white,
          }}
        >
          M
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 8,
            height: 8,
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
