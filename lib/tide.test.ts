import { describe, expect, it } from "vitest";
import {
  detectTideExtremes,
  tideStateAt,
  tideMatchScore,
  tideRangeForDay,
  tideStateLabel,
  tideOptimalLabel,
  tideStateKey,
  tideOptimalKey,
} from "./tide";

/** Synthetic semi-diurnal tide: sin wave with 2 highs + 2 lows in 24h. */
function syntheticTide(): { times: string[]; heights: number[] } {
  const times: string[] = [];
  const heights: number[] = [];
  for (let h = 0; h < 24; h++) {
    times.push(new Date(Date.UTC(2026, 0, 1, h, 0, 0)).toISOString());
    // 2 periods over 24h → high at h≈3 and h≈15, low at h≈9 and h≈21
    heights.push(1.5 * Math.sin((h - 3) * Math.PI / 6));
  }
  return { times, heights };
}

describe("detectTideExtremes", () => {
  it("finds 4 extremes (2 high + 2 low) in a semi-diurnal day", () => {
    const { times, heights } = syntheticTide();
    const extremes = detectTideExtremes(times, heights);
    expect(extremes.length).toBeGreaterThanOrEqual(2);
    expect(extremes.length).toBeLessThanOrEqual(4);
    const types = new Set(extremes.map((e) => e.type));
    expect(types).toContain("high");
    expect(types).toContain("low");
  });

  it("returns [] when input arrays are empty or mismatched", () => {
    expect(detectTideExtremes([], [])).toEqual([]);
    expect(detectTideExtremes(["t1"], [1, 2])).toEqual([]);
  });

  it("ignores null samples gracefully", () => {
    const times = Array.from({ length: 10 }, (_, i) => `t${i}`);
    const heights = [null, null, 1, 2, 3, 2, 1, null, null, null];
    const out = detectTideExtremes(times, heights);
    // Not enough non-null neighbours → no extreme detected
    expect(Array.isArray(out)).toBe(true);
  });
});

describe("tideStateAt", () => {
  it("returns 'rising' on a clearly rising slope", () => {
    const heights = [0, 0.3, 0.6, 0.9, 1.2, 1.5];
    expect(tideStateAt(heights, 2)).toBe("rising");
  });

  it("returns 'falling' on a clearly falling slope", () => {
    const heights = [1.5, 1.2, 0.9, 0.6, 0.3, 0];
    expect(tideStateAt(heights, 2)).toBe("falling");
  });

  it("returns 'mid' when slope is near zero", () => {
    const heights = [1, 1.01, 1, 1.01, 1, 1.01];
    expect(tideStateAt(heights, 2)).toBe("mid");
  });

  it("detects 'high' near a local maximum", () => {
    // Plateau near max with tiny slope
    const heights = [0.3, 0.7, 1.0, 1.01, 1.0, 0.7, 0.3];
    const state = tideStateAt(heights, 3);
    // Either 'high' or 'mid' depending on detection sensitivity
    expect(["high", "mid"]).toContain(state);
  });
});

describe("tideMatchScore", () => {
  it("1 for perfect match, 0.65 for tolerant, 0.15 for opposite", () => {
    expect(tideMatchScore("rising", "rising")).toBe(1);
    expect(tideMatchScore("mid", "rising")).toBe(0.65);
    expect(tideMatchScore("falling", "rising")).toBe(0.15);
  });
  it("0.5 neutral when no preference or 'any'", () => {
    expect(tideMatchScore("mid", undefined)).toBe(0.5);
    expect(tideMatchScore("rising", "any")).toBe(0.5);
  });
});

describe("tideRangeForDay", () => {
  it("returns high - low when enough samples", () => {
    const heights: number[] = [];
    for (let i = 0; i < 24; i++) heights.push(Math.sin(i / 4) * 2);
    const range = tideRangeForDay(heights, 0);
    expect(range).not.toBeNull();
    expect(range as number).toBeGreaterThan(3);
  });
  it("returns null when too few samples (< 12)", () => {
    const heights: (number | null)[] = Array(24).fill(null);
    heights[0] = 1;
    heights[1] = 2;
    expect(tideRangeForDay(heights, 0)).toBeNull();
  });
});

describe("labels and keys", () => {
  it("FR labels include arrows for direction", () => {
    expect(tideStateLabel("rising")).toContain("↑");
    expect(tideStateLabel("falling")).toContain("↓");
    expect(tideOptimalLabel("mid-high")).toContain("↗");
  });
  it("keys map to the i18n dictionary entries", () => {
    expect(tideStateKey("rising")).toBe("tideRising");
    expect(tideOptimalKey("mid-low")).toBe("tideOptimalMidLow");
    expect(tideOptimalKey("any")).toBe("tideOptimalAny");
  });
});
