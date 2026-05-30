import { ImageResponse } from "next/og";
import { getSpotBySlug } from "@/lib/spots";
import { fetchSpotForecast } from "@/lib/api";
import { scoreLabel } from "@/lib/score";
import { tideOptimalLabel } from "@/lib/tide";

export const runtime = "nodejs";
export const alt = "Surf prévision Yosurf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Region-specific gradient for the OG background
const REGION_BG: Record<string, [string, string, string]> = {
  "Manche & Nord": ["#cbd5e1", "#36c4f7", "#0c5b80"],
  "Bretagne": ["#5eead4", "#066e9b", "#062c47"],
  "Atlantique Nord": ["#7ddafe", "#14b8a6", "#066e9b"],
  "Aquitaine": ["#fcf0d0", "#f5a430", "#ea580c"],
  "Pays Basque": ["#fda4af", "#f97316", "#fbbf24"],
  "Méditerranée": ["#5eead4", "#14b8a6", "#0c5b80"],
  "Corse": ["#86efac", "#14b8a6", "#fbbf24"],
  "Outre-Mer": ["#86efac", "#fb923c", "#dc2626"],
};

const SCORE_COLORS: Record<string, string> = {
  excellent: "#10b981",
  good: "#eab308",
  medium: "#fb923c",
  poor: "#ef4444",
};

function tone(score: number) {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "medium";
  return "poor";
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) {
    return new Response("Not found", { status: 404 });
  }

  let score = 0, waveHeight: number | null = null, wavePeriod: number | null = null, windSpeed: number | null = null;
  let effectiveWaveHeight: number | null = null;
  let wavePower: number | null = null;
  try {
    const forecast = await fetchSpotForecast(spot, "intermediate");
    const d = forecast.days[0];
    score = d.score;
    waveHeight = d.waveHeight;
    wavePeriod = d.wavePeriod;
    windSpeed = d.windSpeed;
    effectiveWaveHeight = d.effectiveWaveHeight ?? null;
    wavePower = d.wavePower ?? null;
  } catch { /* ignore — fall back to spot-only display */ }

  const colors = REGION_BG[spot.region] ?? ["#36c4f7", "#066e9b", "#062c47"];
  const t = tone(score);
  const scoreColor = SCORE_COLORS[t];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 45%, ${colors[2]} 100%)`,
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle dark overlay for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.45) 100%)",
            display: "flex",
          }}
        />

        {/* Top row: brand + region badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg, #f43f5e 0%, #f97316 55%, #fbbf24 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 900,
                color: "white",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              Y
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, display: "flex" }}>
              <span style={{ color: "white" }}>yo</span>
              <span style={{ color: "#fde68a" }}>surf</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.35)",
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 600,
              backdropFilter: "blur(10px)",
            }}
          >
            {spot.region} · {spot.department}
          </div>
        </div>

        {/* Middle: spot name */}
        <div style={{ display: "flex", flexDirection: "column", position: "relative", marginTop: 20 }}>
          <div
            style={{
              fontSize: spot.name.length > 28 ? 78 : 96,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              display: "flex",
            }}
          >
            {spot.shortName}
          </div>
          <div style={{ fontSize: 30, marginTop: 12, color: "rgba(255,255,255,0.85)", fontStyle: "italic", display: "flex", gap: 18, alignItems: "center" }}>
            <span>{spot.type}</span>
            {spot.tideOptimal && spot.tideOptimal !== "any" && (
              <span style={{ fontSize: 20, padding: "4px 14px", borderRadius: 999, background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.85)", fontStyle: "normal", letterSpacing: 1 }}>
                {tideOptimalLabel(spot.tideOptimal)}
              </span>
            )}
            {effectiveWaveHeight != null && waveHeight != null && effectiveWaveHeight > waveHeight + 0.1 && (
              <span style={{ fontSize: 20, padding: "4px 14px", borderRadius: 999, background: "rgba(245,164,48,0.35)", color: "#fff7e0", fontStyle: "normal", letterSpacing: 1 }}>
                sets ~{effectiveWaveHeight.toFixed(1)} m
              </span>
            )}
          </div>
        </div>

        {/* Bottom: score + conditions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            paddingTop: 30,
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              Conditions du jour
            </div>
            <div style={{ display: "flex", gap: 28, fontSize: 28 }}>
              <Condition label="Vague" value={waveHeight != null ? `${waveHeight.toFixed(1)} m` : "—"} />
              <Condition label="Période" value={wavePeriod != null ? `${wavePeriod.toFixed(0)} s` : "—"} />
              <Condition label="Vent" value={windSpeed != null ? `${windSpeed.toFixed(0)} km/h` : "—"} />
              <Condition label="Puissance" value={wavePower != null ? `${wavePower.toFixed(1)} kW/m` : "—"} />
            </div>
          </div>

          {/* Score gauge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 28px",
              borderRadius: 24,
              background: `${scoreColor}30`,
              border: `2px solid ${scoreColor}`,
            }}
          >
            <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1, color: scoreColor }}>{score}</div>
            <div style={{ fontSize: 16, color: scoreColor, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>
              {scoreLabel(score)}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

function Condition({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800 }}>{value}</div>
    </div>
  );
}
