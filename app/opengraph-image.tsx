import { ImageResponse } from "next/og";
import { SPOTS } from "@/lib/spots";

export const runtime = "edge";
export const alt = "Yosurf — yo, ta vague est prête";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 70,
          background:
            "linear-gradient(135deg, #061320 0%, #062c47 35%, #f43f5e 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: logo + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              background: "linear-gradient(135deg, #f43f5e 0%, #f97316 55%, #fbbf24 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              fontWeight: 900,
              color: "white",
              boxShadow: "0 8px 32px rgba(244, 63, 94, 0.5)",
            }}
          >
            Y
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: -1, display: "flex" }}>
              <span style={{ color: "white" }}>yo</span>
              <span
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #f43f5e 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                surf
              </span>
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase" }}>
              la carte des vagues
            </div>
          </div>
        </div>

        {/* Center: big tagline */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
              display: "flex",
              gap: 18,
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #b9ebff 60%, #36c4f7 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Yo, ta vague
            </span>
          </div>
          <div
            style={{
              fontSize: 100,
              fontWeight: 700,
              lineHeight: 1,
              fontStyle: "italic",
              marginTop: 10,
              background: "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #f43f5e 100%)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            est prête.
          </div>
        </div>

        {/* Bottom: stats strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 30,
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <Stat number={SPOTS.length.toString()} label="spots français" />
            <Stat number="7j" label="prévisions" />
            <Stat number="24h" label="détail horaire" />
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", display: "flex" }}>
            yosurf.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontSize: 42,
          fontWeight: 900,
          background: "linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f97316 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}
