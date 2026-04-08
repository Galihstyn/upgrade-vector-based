import { expect, test, describe } from "bun:test";
import { hexToRgb, hexToHsv, hsvToHex } from "./colorUtils";

describe("hexToRgb", () => {
  test("converts standard 6-digit hex to RGB", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
  });

  test("converts 3-digit hex to RGB", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#f00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  test("handles hex without #", () => {
    expect(hexToRgb("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("f00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  test("handles whitespace", () => {
    expect(hexToRgb("  #ffffff  ")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("\t#ff0000\n")).toEqual({ r: 255, g: 0, b: 0 });
  });

  test("returns black for invalid hex", () => {
    expect(hexToRgb("invalid")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#gggggg")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#ff")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#fffff")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#fffffff")).toEqual({ r: 0, g: 0, b: 0 });
  });

  test("handles null/undefined input (defaults to #000000)", () => {
    expect(hexToRgb(null)).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb(undefined)).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("")).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe("hexToHsv and hsvToHex roundtrip", () => {
  test("converts hex to HSV and back to hex", () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000", "#808080"];
    colors.forEach(hex => {
      const hsv = hexToHsv(hex);
      const resultHex = hsvToHex(hsv.h, hsv.s, hsv.v);
      expect(resultHex).toBe(hex);
    });
  });
});
