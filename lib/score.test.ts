import { describe, expect, it } from "vitest";
import {
  computeScore,
  computeWavePower,
  effectiveWaveHeight,
  isEngagedSurf,
  scoreLabel,
  scoreLabelKey,
  scoreTone,
} from "./score";

describe("computeWavePower", () => {
  it("uses formula 0.49 * H² * T", () => {
    // 1.5m, 10s → 0.49 * 2.25 * 10 = 11.025 → rounded to 11.0
    expect(computeWavePower(1.5, 10)).toBe(11.0);
    // 2m, 12s → 0.49 * 4 * 12 = 23.52 → 23.5
    expect(computeWavePower(2, 12)).toBe(23.5);
  });
  it("returns null on missing inputs", () => {
    expect(computeWavePower(null, 10)).toBeNull();
    expect(computeWavePower(1.5, undefined)).toBeNull();
  });
});

describe("effectiveWaveHeight", () => {
  it("returns raw height when period <= 9s", () => {
    expect(effectiveWaveHeight(1.5, 8)).toBe(1.5);
    expect(effectiveWaveHeight(1.5, 9)).toBe(1.5);
  });
  it("amplifies +17.5% per second above 9s", () => {
    // 1m, 11s → 1 * (1 + 0.175 * 2) = 1.35
    expect(effectiveWaveHeight(1, 11)).toBe(1.4); // rounded
    // 2m, 14s → 2 * (1 + 0.175 * 5) = 2 * 1.875 = 3.75
    expect(effectiveWaveHeight(2, 14)).toBe(3.8);
  });
  it("handles null period gracefully (returns raw rounded)", () => {
    expect(effectiveWaveHeight(1.5, null)).toBe(1.5);
  });
});

describe("isEngagedSurf", () => {
  it("beginner: anything > 1.2m raw or > 10s period qualifies as engaged", () => {
    expect(isEngagedSurf(1.3, 8, "beginner")).toBe(true);
    expect(isEngagedSurf(0.8, 11, "beginner")).toBe(true);
    expect(isEngagedSurf(0.8, 8, "beginner")).toBe(false);
  });
  it("intermediate: engaged when effective > 2.3m OR (>1.5m AND >12s)", () => {
    expect(isEngagedSurf(2.5, 8, "intermediate")).toBe(true);
    expect(isEngagedSurf(1.6, 13, "intermediate")).toBe(true);
    expect(isEngagedSurf(1.5, 12, "intermediate")).toBe(false);
  });
  it("advanced never engaged (no upper cap)", () => {
    expect(isEngagedSurf(5, 18, "advanced")).toBe(false);
  });
});

describe("computeScore", () => {
  it("returns 0 for missing wave height", () => {
    expect(computeScore(null, 10, 10, 270, 270, "intermediate")).toBe(0);
  });

  it("returns 0 for non-advanced on a worldClass spot", () => {
    expect(
      computeScore(1.5, 10, 10, 270, 270, "beginner", { worldClass: true })
    ).toBe(0);
    expect(
      computeScore(1.5, 10, 10, 270, 270, "intermediate", { worldClass: true })
    ).toBe(0);
    // Advanced still get a real score
    expect(
      computeScore(2, 12, 10, 270, 270, "advanced", { worldClass: true })
    ).toBeGreaterThan(0);
  });

  it("returns 0 for beginner in engaged-surf conditions", () => {
    expect(computeScore(1.6, 11, 5, 270, 270, "beginner")).toBe(0);
  });

  it("caps intermediate score at 45 in engaged surf", () => {
    // engaged conditions for intermediate: effective > 2.3 OR (>1.5 AND >12s)
    const score = computeScore(2.5, 13, 8, 270, 270, "intermediate");
    expect(score).toBeLessThanOrEqual(45);
  });

  it("rewards offshore wind, penalises onshore wind", () => {
    const offshore = 270;
    const sameWaves: [number, number, number] = [1.5, 10, 15];
    const offshoreScore = computeScore(...sameWaves, offshore, offshore, "intermediate");
    const onshoreScore = computeScore(...sameWaves, 90, offshore, "intermediate");
    expect(offshoreScore).toBeGreaterThan(onshoreScore);
  });

  it("produces higher scores for ideal conditions than for flat sea", () => {
    const flat = computeScore(0.2, 4, 25, 0, 270, "intermediate");
    const ideal = computeScore(1.5, 12, 5, 270, 270, "intermediate");
    expect(ideal).toBeGreaterThan(flat);
  });

  it("uses 5-criterion weighting when tide context is provided", () => {
    // Same raw conditions, perfect vs wrong tide → different scores
    const withGoodTide = computeScore(1.5, 10, 10, 270, 270, "intermediate", {
      tideOptimal: "rising",
      tideState: "rising",
    });
    const withBadTide = computeScore(1.5, 10, 10, 270, 270, "intermediate", {
      tideOptimal: "rising",
      tideState: "falling",
    });
    expect(withGoodTide).toBeGreaterThan(withBadTide);
  });
});

describe("scoreLabel / scoreLabelKey / scoreTone", () => {
  it("buckets correctly", () => {
    expect(scoreLabel(85)).toBe("Magique");
    expect(scoreLabelKey(85)).toBe("scoreMagic");
    expect(scoreTone(85)).toBe("excellent");

    expect(scoreLabelKey(65)).toBe("scorePlay");
    expect(scoreTone(65)).toBe("good");

    expect(scoreLabelKey(45)).toBe("scorePossible");
    expect(scoreTone(45)).toBe("medium");

    expect(scoreLabelKey(25)).toBe("scoreSoft");
    expect(scoreTone(25)).toBe("poor");

    expect(scoreLabelKey(5)).toBe("scoreFlat");
  });
});
