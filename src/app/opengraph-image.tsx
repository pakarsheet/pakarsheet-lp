import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const alt = "Pakarsheet - Template Google Sheets Premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#030303",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 400,
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "white",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "black",
            }}
          >
            P
          </div>
          <span style={{ color: "white", fontSize: 36, fontWeight: 700, letterSpacing: "-1px" }}>
            Pakarsheet
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          Template Google Sheets
          <br />
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Bebas Ribet untuk Bisnis.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 24,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Otomasi Apps Script · UI Bersih · Lifetime Update
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 100,
            color: "rgba(255,255,255,0.7)",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#22c55e", fontSize: 10 }}>●</span>
          pakarsheet.com
        </div>
      </div>
    ),
    { ...size }
  );
}
