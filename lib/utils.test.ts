import { describe, expect, it } from "vitest";
import { fmt, degToCardinal, haversineKm } from "./utils";

describe("utils", () => {
  it("fmt rounds and formats numbers", () => {
    expect(fmt(1.23)).toBe("1.2");
    expect(fmt(1.567, 0)).toBe("2");
    expect(fmt(null)).toBe("—");
  });

  it("degToCardinal maps bearings to N/NE/E/... (FR cardinals)", () => {
    expect(degToCardinal(0)).toBe("N");
    expect(degToCardinal(90)).toBe("E");
    expect(degToCardinal(180)).toBe("S");
    expect(degToCardinal(270)).toBe("O");   // Ouest, not West
    expect(degToCardinal(null)).toBe("");
  });

  it("haversineKm gives plausible distance Paris ↔ Marseille (~660km)", () => {
    const km = haversineKm(48.857, 2.353, 43.297, 5.370);
    expect(km).toBeGreaterThan(650);
    expect(km).toBeLessThan(700);
  });
});
