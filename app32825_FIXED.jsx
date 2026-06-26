import React, { useState, useEffect, useRef, useCallback } from "react";
import { fabric } from "fabric";
import {
  Type,
  Square,
  Circle,
  Plus,
  Undo2,
  Redo2,
  ZoomOut,
  ZoomIn,
  MousePointer2,
  Trash2,
  Image as ImageIcon,
  Layers,
  Settings2,
  Download,
  Lock,
  ArrowUp,
  ArrowDown,
  MousePointerClick,
  Star,
  Triangle as TriangleIcon,
  Pipette,
  Sun,
  PenTool,
  PlusCircle,
  MinusCircle,
  CornerUpRight,
  Maximize,
  Box,
  Palette,
  Check,
  AlertCircle,
  Waves,
  Monitor,
  AlertTriangle,
  ShoppingCart,
  Hexagon,
  Heart,
  ArrowRight,
  ArrowLeft,
  Minus,
} from "lucide-react";

// --- CONSTANTS & CONFIGURATION ---

const GOOGLE_FONTS = [
  // Minimalist & Clean
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Quicksand",
  "Nunito",
  "Ubuntu",
  "Rubik",
  // Bold & Display
  "Oswald",
  "Bebas Neue",
  "Anton",
  "Righteous",
  "Russo One",
  // Serif & Elegant
  "Playfair Display",
  "Lora",
  "Merriweather",
  "Cinzel",
  "Josefin Sans",
  // Script & Handwritten
  "Dancing Script",
  "Great Vibes",
  "Alex Brush",
  "Pacifico",
  "Caveat",
  "Amatic SC",
  "Permanent Marker",
  "Fredoka One",
];

const ILLUSTRATOR_SWATCHES = [
  // Grayscale
  "#000000",
  "#1A1A1A",
  "#333333",
  "#4D4D4D",
  "#666666",
  "#808080",
  "#999999",
  "#B3B3B3",
  "#CCCCCC",
  "#E6E6E6",
  "#F2F2F2",
  "#FFFFFF",
  // Vibrant Colors
  "#FF0000",
  "#FF4500",
  "#FF8C00",
  "#FFA500",
  "#FFD700",
  "#FFFF00",
  "#ADFF2F",
  "#00FF00",
  "#00FA9A",
  "#00FFFF",
  "#00BFFF",
  "#0000FF",
  "#4B0082",
  "#8B00FF",
  "#FF00FF",
  "#FF1493",
  // Modern / Brand Colors
  "#E11D48",
  "#F43F5E",
  "#F59E0B",
  "#D97706",
  "#10B981",
  "#059669",
  "#3B82F6",
  "#2563EB",
  "#6366F1",
  "#4F46E5",
  "#8B5CF6",
  "#7C3AED",
  // Pastel Tones
  "#FECACA",
  "#FED7AA",
  "#FEF08A",
  "#BBF7D0",
  "#BAE6FD",
  "#C7D2FE",
  "#E9D5FF",
  "#FBCFE8",
  // Earth Tones
  "#451A03",
  "#78350F",
  "#92400E",
  "#B45309",
  "#713F12",
  "#A16207",
  "#3F2E3E",
  "#503C3C",
];

const transformHandles = [
  { dir: "nw", top: "0%", left: "0%", cursor: "nwse-resize" },
  { dir: "n", top: "0%", left: "50%", cursor: "ns-resize" },
  { dir: "ne", top: "0%", left: "100%", cursor: "nesw-resize" },
  { dir: "w", top: "50%", left: "0%", cursor: "ew-resize" },
  { dir: "e", top: "50%", left: "100%", cursor: "ew-resize" },
  { dir: "sw", top: "100%", left: "0%", cursor: "nesw-resize" },
  { dir: "s", top: "100%", left: "50%", cursor: "ns-resize" },
  { dir: "se", top: "100%", left: "100%", cursor: "nwse-resize" },
];

// --- RELEASE FEATURE LOCKS (temporary stability mode) ---
const RELEASE_VISIBLE_SHAPES = ["rect", "circle", "star", "triangle"];
const RELEASE_DIRECT_SELECT_TYPES = ["rect", "star", "triangle"];
const RELEASE_ENABLE_PATHFINDER = false;
const MAX_UPLOAD_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const CART_PREVIEW_MAX_DATA_URL_LENGTH = 85000;
const PRODUCT_BACKGROUND_FETCH_LIMIT = 250;

const SHAPE_TOOL_ITEMS = [
  { type: "rect", icon: Square, label: "Rectangle" },
  { type: "circle", icon: Circle, label: "Circle" },
  { type: "star", icon: Star, label: "Star" },
  { type: "triangle", icon: TriangleIcon, label: "Triangle" },
  { type: "hexagon", icon: Hexagon, label: "Hexagon" },
  { type: "heart", icon: Heart, label: "Heart" },
  { type: "arrow", icon: ArrowRight, label: "Arrow" },
  { type: "line", icon: Minus, label: "Line" },
];

// --- GLOBAL HELPER FUNCTIONS ---

const slugify = (text) =>
  text
    ? text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
    : "untitled";

const safeNum = (val, fallback = 0) => {
  const num = Number(val);
  return isNaN(num) || !isFinite(num) ? fallback : num;
};

const hexToRgb = (hex) => {
  let normalized = (hex || "#000000").trim();

  if (!normalized.startsWith("#")) normalized = "#" + normalized;

  if (normalized.length === 4) {
    normalized =
      "#" +
      normalized[1] +
      normalized[1] +
      normalized[2] +
      normalized[2] +
      normalized[3] +
      normalized[3];
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: parseInt(normalized.substring(1, 3), 16),
    g: parseInt(normalized.substring(3, 5), 16),
    b: parseInt(normalized.substring(5, 7), 16),
  };
};

const hexToHsv = (hex) => {
  let { r, g, b } = hexToRgb(hex);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;
  const d = max - min;

  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToHex = (h, s, v) => {
  h /= 360;
  s /= 100;
  v /= 100;
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

let measureCanvasCtx = null;
const measureTextWidth = (text, fontSize, fontFamily) => {
  const safeText = text || "";
  const safeFontSize = safeNum(fontSize, 32);
  if (!measureCanvasCtx && typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    measureCanvasCtx = canvas.getContext("2d");
  }
  if (measureCanvasCtx) {
    measureCanvasCtx.font = `bold ${safeFontSize}px "${fontFamily || "Inter"}", sans-serif`;
    const lines = safeText.split("\n");
    let maxWidth = 0;
    lines.forEach((line) => {
      try {
        maxWidth = Math.max(maxWidth, measureCanvasCtx.measureText(line).width);
      } catch (e) {
        maxWidth = safeText.length * safeFontSize * 0.6;
      }
    });
    return maxWidth;
  }
  return safeText.length * safeFontSize * 0.6;
};

const getWarpMetrics = (el) => {
  // Menggunakan spread operator [...] alih-alih .split("") agar Emoji (surrogate pairs) tidak terbelah 2 saat dilengkungkan
  const chars = [...(el.content || "").replace(/\n/g, " ")];
  const B = safeNum(el.warpBend, 0) / 100;
  const DH = safeNum(el.warpDistortH, 0) / 100;
  const DV = safeNum(el.warpDistortV, 0) / 100;
  const H = safeNum(el.fontSize, 32);
  const LS = safeNum(el.letterSpacing, 0);
  const W = (H * 0.6 + LS) * Math.max(1, chars.length);
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  const positions = chars.map((char, charIdx) => {
    let t = chars.length > 1 ? (charIdx + 0.5) / chars.length - 0.5 : 0; // -0.5 to 0.5

    // Apply Horizontal Distortion by shifting t
    if (Math.abs(DH) > 0.01) {
      // Skew t: t_new = t * (1 - DH*t*2) or similar to compress one side
      t = t * (1 - DH * t);
    }

    let dx = 0,
      dy = 0,
      angle = 0,
      sX = 1,
      sY = 1;

    const style = el.warpStyle || "none";
    if (style === "arc") {
      if (Math.abs(B) > 0.01) {
        const maxAngle = B * Math.PI;
        const R = W / maxAngle;
        const theta = t * maxAngle;
        dx = R * Math.sin(theta);
        dy = R * (1 - Math.cos(theta));
        angle = theta;
      } else dx = t * W;
    } else if (style === "arcLower") {
      dx = t * W;
      sY = 1 + B * (1 - 4 * t * t);
      dy = ((sY - 1) * H) / 2;
    } else if (style === "arcUpper") {
      dx = t * W;
      sY = 1 + B * (1 - 4 * t * t);
      dy = (-(sY - 1) * H) / 2;
    } else if (style === "arch") {
      dx = t * W;
      dy = -B * (W / 2) * (1 - 4 * t * t);
    } else if (style === "bulge") {
      dx = t * W;
      sY = 1 + B * (1 - 4 * t * t);
      sX = 1 + Math.abs(B) * 0.2 * (1 - 4 * t * t);
    } else if (style === "shellLower") {
      angle = (t * B * Math.PI) / 2;
      dx = t * W;
      sY = 1 + B * (t + 0.5);
    } else if (style === "shellUpper") {
      angle = (-t * B * Math.PI) / 2;
      dx = t * W;
      sY = 1 - B * (t + 0.5);
    } else if (style === "flag") {
      dx = t * W;
      dy = B * (H * 0.8) * Math.sin(t * Math.PI);
    } else if (style === "wave") {
      dx = t * W;
      dy = B * (H * 0.8) * Math.sin(t * 2 * Math.PI);
    } else if (style === "fish") {
      dx = t * W;
      sY = 1 + B * (t + 0.5);
      sX = 1 + Math.abs(B) * 0.1;
    } else if (style === "rise") {
      dx = t * W;
      dy = -B * (W / 4) * t;
    } else if (style === "fishEye") {
      dx = t * W * (1 + Math.abs(B) * (1 - 4 * t * t));
      sY = 1 + Math.abs(B) * (1 - 4 * t * t);
    } else if (style === "inflate") {
      dx = t * W;
      sY = 1 + B * (1 - 4 * t * t);
      sX = 1 + B * (1 - 4 * t * t);
    } else if (style === "squeeze") {
      dx = t * W;
      sY = 1 - B * (1 - 4 * t * t);
      sX = 1 - B * 0.2 * (1 - 4 * t * t);
    } else if (style === "twist") {
      dx = t * W;
      angle = t * B * Math.PI;
    } else if (style === "perspective") {
      sY = 1 + B * t * 2;
      dx = t * (W * (1 + Math.abs(B) * 0.2));
      dy = 0;
      angle = 0;
    }

    // Apply Vertical Distortion by tapering sY
    if (Math.abs(DV) > 0.01) {
      const taper = 1 + DV * t * 2;
      sY *= taper;
      dy += ((taper - 1) * H) / 2;
    }

    const curWidth = H * 0.6 * sX;
    const curHeight = H * sY;
    const halfW = curWidth / 2;
    const halfH = curHeight / 2;
    const rad = angle;
    const corners = [
      { x: -halfW, y: -halfH },
      { x: halfW, y: -halfH },
      { x: halfW, y: halfH },
      { x: -halfW, y: halfH },
    ].map((p) => ({
      x: dx + p.x * Math.cos(rad) - p.y * Math.sin(rad),
      y: dy + p.x * Math.sin(rad) + p.y * Math.cos(rad),
    }));

    corners.forEach((c) => {
      if (c.x < minX) minX = c.x;
      if (c.x > maxX) maxX = c.x;
      if (c.y < minY) minY = c.y;
      if (c.y > maxY) maxY = c.y;
    });

    return { char, dx, dy, angle, sX, sY };
  });

  if (minX === Infinity)
    return { positions: [], width: 10, height: 10, cx: 0, cy: 0 };
  const padding = H * 0.2;
  return {
    positions,
    width: maxX - minX + padding,
    height: maxY - minY + padding,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
};

const getIntrinsicBounds = (el) => {
  if (el.type === "text" && el.warpStyle && el.warpStyle !== "none") {
    const metrics = getWarpMetrics(el);
    return {
      w: Math.max(10, metrics.width),
      h: Math.max(10, metrics.height),
      metrics,
    };
  } else if (el.type === "text") {
    const w = measureTextWidth(el.content, el.fontSize, el.fontFamily);
    const ls = safeNum(el.letterSpacing, 0);
    const lines = (el.content || "").split("\n");
    const h =
      lines.length * (safeNum(el.fontSize, 32) * safeNum(el.lineHeight, 1.2));
    return {
      w: Math.max(10, w + (el.content?.length || 0) * ls),
      h: Math.max(10, h),
      metrics: null,
    };
  }
  return {
    w: Math.max(10, el.width || 100),
    h: Math.max(10, el.height || 100),
  };
};

const getCustomPointBounds = (
  customPoints,
  fallbackW = 100,
  fallbackH = 100,
) => {
  const points = Array.isArray(customPoints)
    ? customPoints
        .filter((point) => point && typeof point === "object")
        .map((point) => ({ x: safeNum(point.x, 0), y: safeNum(point.y, 0) }))
    : [];

  if (points.length === 0) {
    const width = Math.max(10, safeNum(fallbackW, 100));
    const height = Math.max(10, safeNum(fallbackH, 100));
    return {
      points: [],
      minX: 0,
      minY: 0,
      maxX: width,
      maxY: height,
      width,
      height,
      centerX: width / 2,
      centerY: height / 2,
    };
  }

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const width = Math.max(10, maxX - minX);
  const height = Math.max(10, maxY - minY);

  return {
    points,
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
};

const normalizeCustomPointElement = (element, customPoints) => {
  const pointBounds = getCustomPointBounds(
    customPoints,
    element?.width,
    element?.height,
  );

  const normalizedPoints = pointBounds.points.map((point) => ({
    x: point.x - pointBounds.minX,
    y: point.y - pointBounds.minY,
  }));

  // Bug Fix: Objek "Melompat" Saat Menggeser Titik Pada Objek Yang Dirotasi
  // Kita harus memperhitungkan pergeseran titik tengah (center pivot) relatif terhadap sudut rotasi asli
  const oldW = safeNum(element?.width, pointBounds.width);
  const oldH = safeNum(element?.height, pointBounds.height);
  const oldLocalCx = oldW / 2;
  const oldLocalCy = oldH / 2;

  const newLocalCx = pointBounds.minX + pointBounds.width / 2;
  const newLocalCy = pointBounds.minY + pointBounds.height / 2;

  const deltaLocalCx = newLocalCx - oldLocalCx;
  const deltaLocalCy = newLocalCy - oldLocalCy;

  const rad = safeNum(element?.rotation, 0) * (Math.PI / 180);

  // Transformasi pergerakan titik tengah lokal (yang belum dirotasi) ke posisi global (yang terlihat di layar)
  const deltaGlobalCx =
    deltaLocalCx * Math.cos(rad) - deltaLocalCy * Math.sin(rad);
  const deltaGlobalCy =
    deltaLocalCx * Math.sin(rad) + deltaLocalCy * Math.cos(rad);

  // Titik tengah global sebelumnya
  const oldGlobalCx = safeNum(element?.x, 0) + oldLocalCx;
  const oldGlobalCy = safeNum(element?.y, 0) + oldLocalCy;

  // Titik tengah global yang baru
  const newGlobalCx = oldGlobalCx + deltaGlobalCx;
  const newGlobalCy = oldGlobalCy + deltaGlobalCy;

  // Kembalikan ke koordinat x, y (kiri atas) yang baru
  const newX = newGlobalCx - pointBounds.width / 2;
  const newY = newGlobalCy - pointBounds.height / 2;

  // Preserve the original shape type so properties aren't lost (Bug Fix: Shape Conversion Bug)
  const originalType = element?.originalType || element?.type;

  return {
    ...element,
    type: originalType,
    originalType: originalType,
    x: newX,
    y: newY,
    width: pointBounds.width,
    height: pointBounds.height,
    customPoints: normalizedPoints,
  };
};

const getVisualBounds = (el) => {
  const intrinsic = getIntrinsicBounds(el);
  if (el.type === "text") {
    return {
      w: Math.max(10, intrinsic.w * safeNum(el.scaleX, 1)),
      h: Math.max(10, intrinsic.h * safeNum(el.scaleY, 1)),
    };
  }
  if (Array.isArray(el.customPoints) && el.customPoints.length > 1) {
    const pointBounds = getCustomPointBounds(
      el.customPoints,
      el.width,
      el.height,
    );
    return { w: pointBounds.width, h: pointBounds.height };
  }
  return {
    w: Math.max(10, el.width || 100),
    h: Math.max(10, el.height || 100),
  };
};

const getElementBounds = (el) => {
  const rad = (safeNum(el.rotation, 0) * Math.PI) / 180;

  if (Array.isArray(el.customPoints) && el.customPoints.length > 1) {
    const pointBounds = getCustomPointBounds(
      el.customPoints,
      el.width,
      el.height,
    );
    const cx = safeNum(el.x, 0) + pointBounds.centerX;
    const cy = safeNum(el.y, 0) + pointBounds.centerY;
    const transformedPoints = pointBounds.points.map((point) => {
      const relX = point.x - pointBounds.centerX;
      const relY = point.y - pointBounds.centerY;
      return {
        x: cx + relX * Math.cos(rad) - relY * Math.sin(rad),
        y: cy + relX * Math.sin(rad) + relY * Math.cos(rad),
      };
    });

    return {
      minX: Math.min(...transformedPoints.map((point) => point.x)),
      maxX: Math.max(...transformedPoints.map((point) => point.x)),
      minY: Math.min(...transformedPoints.map((point) => point.y)),
      maxY: Math.max(...transformedPoints.map((point) => point.y)),
    };
  }

  const bounds = getVisualBounds(el);
  const w = bounds.w;
  const h = bounds.h;
  const cx = safeNum(el.x, 0) + w / 2;
  const cy = safeNum(el.y, 0) + h / 2;
  const corners = [
    { x: -w / 2, y: -h / 2 },
    { x: w / 2, y: -h / 2 },
    { x: w / 2, y: h / 2 },
    { x: -w / 2, y: h / 2 },
  ].map((point) => ({
    x: cx + point.x * Math.cos(rad) - point.y * Math.sin(rad),
    y: cy + point.x * Math.sin(rad) + point.y * Math.cos(rad),
  }));
  return {
    minX: Math.min(...corners.map((c) => c.x)),
    maxX: Math.max(...corners.map((c) => c.x)),
    minY: Math.min(...corners.map((c) => c.y)),
    maxY: Math.max(...corners.map((c) => c.y)),
  };
};

const getStarPath = (w, h, points = 5, innerScale = 0.5) => {
  let path = "";
  const cx = w / 2,
    cy = h / 2,
    outerR = w / 2,
    innerR = (w / 2) * innerScale;
  for (let i = 0; i < 2 * points; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * (h / w) * Math.sin(angle);
    path += (i === 0 ? "M" : "L") + `${x},${y}`;
  }
  return path + "Z";
};

const getTrianglePath = (w, h) => `M${w / 2},0 L${w},${h} L0,${h} Z`;

const getDefaultPoints = (el, bounds) => {
  const w = bounds.w,
    h = bounds.h;
  if (el.type === "rect")
    return [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ];
  if (el.type === "triangle")
    return [
      { x: w / 2, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ];
  if (el.type === "hexagon")
    return [
      { x: w * 0.5, y: h * 0.05 },
      { x: w * 0.95, y: h * 0.25 },
      { x: w * 0.95, y: h * 0.75 },
      { x: w * 0.5, y: h * 0.95 },
      { x: w * 0.05, y: h * 0.75 },
      { x: w * 0.05, y: h * 0.25 },
    ];
  if (el.type === "heart")
    return [
      { x: w * 0.5, y: h * 0.9 },
      { x: w * 0.15, y: h * 0.55 },
      { x: w * 0.08, y: h * 0.25 },
      { x: w * 0.5, y: h * 0.35 },
      { x: w * 0.92, y: h * 0.25 },
      { x: w * 0.85, y: h * 0.55 },
    ];
  if (el.type === "arrow")
    return [
      { x: 0, y: h * 0.3 },
      { x: w * 0.6, y: h * 0.3 },
      { x: w * 0.6, y: 0 },
      { x: w, y: h / 2 },
      { x: w * 0.6, y: h },
      { x: w * 0.6, y: h * 0.7 },
      { x: 0, y: h * 0.7 },
    ];
  if (el.type === "star") {
    const pts = el.points || 5;
    const cx = w / 2,
      cy = h / 2,
      outerR = w / 2,
      innerR = (w / 2) * 0.5;
    const result = [];
    for (let i = 0; i < 2 * pts; i++) {
      const angle = (i * Math.PI) / pts - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      result.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * (h / w) * Math.sin(angle),
      });
    }
    return result;
  }
  return [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];
};

const createGradient = (ctx, el, w, h) => {
  const angleRad = (safeNum(el.gradientAngle, 0) * Math.PI) / 180;
  const centerX = w / 2,
    centerY = h / 2;
  const length = Math.sqrt(w * w + h * h);
  const x1 = centerX - (Math.cos(angleRad) * length) / 2;
  const y1 = centerY - (Math.sin(angleRad) * length) / 2;
  const x2 = centerX + (Math.cos(angleRad) * length) / 2;
  const y2 = centerY + (Math.sin(angleRad) * length) / 2;
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, el.color || "#000000");
  grad.addColorStop(1, el.gradientColor2 || "#ffffff");
  return grad;
};

const getSvgFill = (el, idPrefix = "") =>
  el.fillType === "gradient" ? `url(#grad_${idPrefix}${el.id})` : el.color;

const getSvgTextAnchor = (textAlign) => {
  if (textAlign === "center") return "middle";
  if (textAlign === "right") return "end";
  return "start";
};

const getShapePathData = (el, w, h) => {
  if (el.customPoints && el.customPoints.length > 1) {
    return (
      `M${el.customPoints[0].x},${el.customPoints[0].y} ` +
      el.customPoints
        .slice(1)
        .map((p) => `L${p.x},${p.y}`)
        .join(" ") +
      " Z"
    );
  }

  if (el.type === "star") return getStarPath(w, h, el.points || 5);
  if (el.type === "triangle") return getTrianglePath(w, h);
  if (el.type === "hexagon")
    return `M${w / 2},${h * 0.05} L${w * 0.95},${h * 0.25} L${w * 0.95},${h * 0.75} L${w / 2},${h * 0.95} L${w * 0.05},${h * 0.75} L${w * 0.05},${h * 0.25} Z`;
  if (el.type === "heart")
    return `M${w / 2},${h * 0.9} C${w * 0.05},${h * 0.6} 0,${h * 0.25} ${w * 0.25},${h * 0.25} C${w * 0.4},${h * 0.25} ${w / 2},${h * 0.35} ${w / 2},${h * 0.35} C${w / 2},${h * 0.35} ${w * 0.6},${h * 0.25} ${w * 0.75},${h * 0.25} C${w},${h * 0.25} ${w * 0.95},${h * 0.6} ${w / 2},${h * 0.9} Z`;
  if (el.type === "arrow")
    return `M0,${h * 0.3} L${w * 0.6},${h * 0.3} L${w * 0.6},0 L${w},${h / 2} L${w * 0.6},${h} L${w * 0.6},${h * 0.7} L0,${h * 0.7} Z`;
  if (el.type === "line") return `M0,${h / 2} L${w},${h / 2}`;

  return null;
};

const renderSvgShapeInner = (
  child,
  fill,
  strokeColor = "none",
  strokeWidth = 0,
  strokeJoin = "round",
) => {
  if (!child || typeof child !== "object") return null;

  const w = safeNum(child.width, 100);
  const h = safeNum(child.height, 100);
  const cx = safeNum(child.localX, 0) + w / 2;
  const cy = safeNum(child.localY, 0) + h / 2;
  const pathData = getShapePathData(child, w, h);

  return (
    <g
      transform={`translate(${cx}, ${cy}) rotate(${safeNum(child.rotation, 0)}) translate(${-w / 2}, ${-h / 2})`}
    >
      {child.type === "rect" && !child.customPoints && (
        <rect
          width={w}
          height={h}
          rx={child.borderRadius || 0}
          ry={child.borderRadius || 0}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin={strokeJoin}
        />
      )}
      {child.type === "circle" && (
        <ellipse
          cx={w / 2}
          cy={h / 2}
          rx={w / 2}
          ry={h / 2}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin={strokeJoin}
        />
      )}
      {pathData && (
        <path
          d={pathData}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin={strokeJoin}
          strokeLinecap={child.type === "line" ? "round" : "butt"}
        />
      )}
    </g>
  );
};

const VALID_ELEMENT_TYPES = new Set([
  "rect",
  "circle",
  "star",
  "triangle",
  "hexagon",
  "heart",
  "arrow",
  "line",
  "text",
  "image",
  "compound",
]);

const VALID_WARP_STYLES = new Set([
  "none",
  "arc",
  "arcLower",
  "arcUpper",
  "arch",
  "bulge",
  "shellLower",
  "shellUpper",
  "flag",
  "wave",
  "fish",
  "rise",
  "fishEye",
  "inflate",
  "squeeze",
  "twist",
  "perspective",
]);

const normalizeHexColor = (value, fallback = "#000000") => {
  let hex = typeof value === "string" ? value.trim() : "";
  if (!hex) return fallback;
  if (!hex.startsWith("#")) hex = "#" + hex;

  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex.toLowerCase() : fallback;
};

const isSafeImageSrc = (value) =>
  typeof value === "string" &&
  (value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("//") ||
    value.startsWith("/") ||
    value.startsWith("blob:") ||
    value.startsWith("data:image/"));

const isTransientImageSrc = (value) =>
  typeof value === "string" &&
  (value.startsWith("blob:") || value.startsWith("data:image/"));

const isPersistableCartImageSrc = (value) =>
  typeof value === "string" &&
  (value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("//") ||
    value.startsWith("/"));

const sanitizeCartImageSrc = (value) =>
  isPersistableCartImageSrc(value) ? value : null;

const normalizeThemeCartResult = (
  result,
  fallbackMessage = "Added to cart by theme!",
) => {
  if (result && typeof result === "object") {
    const success = result.success !== false;
    const explicitMessage =
      typeof result.message === "string" && result.message.trim()
        ? result.message.trim()
        : "";
    const explicitError =
      typeof result.error === "string" && result.error.trim()
        ? result.error.trim()
        : "";

    return {
      success,
      message:
        explicitMessage ||
        (success
          ? fallbackMessage
          : explicitError || "Theme Add to Cart handler failed."),
    };
  }

  if (result === false) {
    return { success: false, message: "Theme Add to Cart handler failed." };
  }

  return { success: true, message: fallbackMessage };
};

const validateStroke = (stroke) => {
  if (!stroke || typeof stroke !== "object") return null;

  return {
    color: normalizeHexColor(stroke.color, "#000000"),
    width: Math.max(0, safeNum(stroke.width, 1)),
    alignment: ["inside", "center", "outside"].includes(stroke.alignment)
      ? stroke.alignment
      : "center",
    join: ["miter", "round", "bevel"].includes(stroke.join)
      ? stroke.join
      : "round",
  };
};

const validateElement = (el, fallbackId = "el_invalid") => {
  if (!el || typeof el !== "object") return null;

  const type = VALID_ELEMENT_TYPES.has(String(el.type || ""))
    ? String(el.type)
    : "rect";
  const safeEl = {
    id: String(el.id || fallbackId),
    type,
    x: safeNum(el.x, 0),
    y: safeNum(el.y, 0),
    width: Math.max(1, safeNum(el.width, 100)),
    height: Math.max(1, safeNum(el.height, 100)),
    rotation: safeNum(el.rotation, 0),
    visible: el.visible !== false,
    locked: !!el.locked,
    opacity: Math.max(0, Math.min(1, safeNum(el.opacity, 1))),
    borderRadius: Math.max(0, safeNum(el.borderRadius, 0)),
    localX: safeNum(el.localX, 0),
    localY: safeNum(el.localY, 0),
    color: normalizeHexColor(el.color, "#000000"),
    fillType: el.fillType === "gradient" ? "gradient" : "solid",
    gradientColor2: normalizeHexColor(el.gradientColor2, "#ffffff"),
    gradientAngle: safeNum(el.gradientAngle, 90),
    strokes: Array.isArray(el.strokes)
      ? el.strokes.map(validateStroke).filter(Boolean).slice(0, 3)
      : [],
  };

  if (safeEl.type === "text") {
    safeEl.content = String(el.content || "");
    safeEl.fontSize = Math.max(1, safeNum(el.fontSize, 32));
    safeEl.fontFamily = String(el.fontFamily || "Inter");
    safeEl.textAlign = ["left", "center", "right"].includes(el.textAlign)
      ? el.textAlign
      : "left";
    safeEl.warpStyle = VALID_WARP_STYLES.has(el.warpStyle)
      ? el.warpStyle
      : "none";
    safeEl.warpBend = safeNum(el.warpBend, 0);
    safeEl.warpDistortH = safeNum(el.warpDistortH, 0);
    safeEl.warpDistortV = safeNum(el.warpDistortV, 0);
    safeEl.scaleX = Math.max(0.01, safeNum(el.scaleX, 1));
    safeEl.scaleY = Math.max(0.01, safeNum(el.scaleY, 1));
    safeEl.letterSpacing = safeNum(el.letterSpacing, 0);
    safeEl.lineHeight = Math.max(0.1, safeNum(el.lineHeight, 1.2));
    safeEl.fontWeight = ["normal", "bold"].includes(el.fontWeight)
      ? el.fontWeight
      : "bold";
    safeEl.fontStyle = ["normal", "italic"].includes(el.fontStyle)
      ? el.fontStyle
      : "normal";
    safeEl.textTransform = ["none", "uppercase", "lowercase"].includes(
      el.textTransform,
    )
      ? el.textTransform
      : "none";
    safeEl.textDecoration = ["none", "underline"].includes(el.textDecoration)
      ? el.textDecoration
      : "none";
  }

  if (safeEl.type === "image") {
    safeEl.src = isSafeImageSrc(el.src) ? el.src : null;
  }

  if (safeEl.type === "star") {
    safeEl.points = Math.max(
      3,
      Math.min(20, Math.round(safeNum(el.points, 5))),
    );
  }

  if (Array.isArray(el.customPoints)) {
    safeEl.customPoints = el.customPoints
      .filter((point) => point && typeof point === "object")
      .map((point) => ({
        x: safeNum(point.x, 0),
        y: safeNum(point.y, 0),
      }));
  }

  if (safeEl.type === "compound") {
    safeEl.operation = ["union", "subtract", "intersect", "exclude"].includes(
      el.operation,
    )
      ? el.operation
      : "union";
    safeEl.sourceOperation = [
      "union",
      "subtract",
      "intersect",
      "exclude",
    ].includes(el.sourceOperation)
      ? el.sourceOperation
      : safeEl.operation;
    safeEl.strokes = [];
    safeEl.children = Array.isArray(el.children)
      ? el.children
          .map((child, index) =>
            validateElement(child, `${safeEl.id}_child_${index}`),
          )
          .filter(Boolean)
      : [];
    safeEl.originalWidth = Math.max(1, safeNum(el.originalWidth, safeEl.width));
    safeEl.originalHeight = Math.max(
      1,
      safeNum(el.originalHeight, safeEl.height),
    );
  }

  return safeEl;
};

const validateProjectData = (data, artboardW = 815, artboardH = 261) => {
  const defaultBackground = {
    id: "bg_base",
    label: "Background",
    src: null,
    color: "#ffffff",
    width: artboardW,
    height: artboardH,
    locked: true,
  };

  if (!data || typeof data !== "object") {
    return { elements: [], background: defaultBackground };
  }

  const validatedElements = Array.isArray(data.elements)
    ? data.elements
        .map((element, index) => validateElement(element, `el_${index}`))
        .filter(Boolean)
    : [];

  let validatedBackground = defaultBackground;

  if (data.background && typeof data.background === "object") {
    validatedBackground = {
      id: String(data.background.id || "bg_base"),
      label: String(data.background.label || "Background"),
      color: normalizeHexColor(data.background.color, "#ffffff"),
      src: isSafeImageSrc(data.background.src) ? data.background.src : null,
      width: Math.max(1, safeNum(data.background.width, artboardW)),
      height: Math.max(1, safeNum(data.background.height, artboardH)),
      locked: data.background.locked !== false,
    };
  } else if (typeof data.canvasBg === "string") {
    validatedBackground = {
      ...defaultBackground,
      color: normalizeHexColor(data.canvasBg, "#ffffff"),
    };
  }

  return { elements: validatedElements, background: validatedBackground };
};

const loadValidatedProjectData = (
  storageKey,
  artboardW = 815,
  artboardH = 261,
  expectedContextSignature = "",
) => {
  if (typeof window === "undefined") {
    return validateProjectData(null, artboardW, artboardH);
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return validateProjectData(null, artboardW, artboardH);
    }

    const parsed = JSON.parse(saved);
    const savedContextSignature =
      typeof parsed?.contextSignature === "string"
        ? parsed.contextSignature
        : "";

    if (
      expectedContextSignature &&
      savedContextSignature &&
      savedContextSignature !== expectedContextSignature
    ) {
      return validateProjectData(null, artboardW, artboardH);
    }

    return validateProjectData(parsed, artboardW, artboardH);
  } catch (e) {
    console.warn("Failed to read saved project data, loading defaults.", e);
    return validateProjectData(null, artboardW, artboardH);
  }
};

const STORAGE_KEY = "tudi_wrap_project_v1";
const SNAPSHOT_SCHEMA_VERSION = "2026-03";
const EDITOR_BUILD_VERSION = "1.4.4-ready-to-live-custom-cart-variant";
const PLACEHOLDER_BACKGROUND_IDS = new Set([
  "none",
  "bg_base",
  "background",
  "placeholder",
]);

const hashString = (value) => {
  const input = String(value || "");
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const buildProjectStorageKey = (contextSignature = "default") =>
  `${STORAGE_KEY}__${contextSignature}`;

const parseBootstrapBackgroundOptions = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const normalizeBackgroundOption = (
  candidate,
  index = 0,
  fallbackWidth = 815,
  fallbackHeight = 261,
) => {
  if (!candidate) return null;

  if (typeof candidate === "string") {
    const src = isSafeImageSrc(candidate) ? candidate : null;
    if (!src) return null;
    return {
      id: `bg_option_${index + 1}`,
      label: `Background ${index + 1}`,
      src,
      color: "#ffffff",
      width: Math.max(1, safeNum(fallbackWidth, 815)),
      height: Math.max(1, safeNum(fallbackHeight, 261)),
      locked: true,
    };
  }

  if (typeof candidate !== "object") return null;

  const src = isSafeImageSrc(candidate.src) ? candidate.src : null;
  const color = normalizeHexColor(candidate.color, "#ffffff");
  const hasVisual = Boolean(src) || Boolean(color);
  if (!hasVisual) return null;

  const fallbackId =
    src || candidate.label || color || `bg_option_${index + 1}`;

  return {
    id: String(candidate.id || fallbackId),
    label: String(candidate.label || `Background ${index + 1}`),
    src,
    color,
    width: Math.max(1, safeNum(candidate.width, fallbackWidth)),
    height: Math.max(1, safeNum(candidate.height, fallbackHeight)),
    locked: candidate.locked !== false,
  };
};

const mergeBackgroundOptions = (...groups) => {
  const merged = [];
  const seen = new Set();

  groups.flat().forEach((candidate, index) => {
    const normalized = normalizeBackgroundOption(
      candidate,
      merged.length + index,
    );
    if (!normalized) return;

    const key = `${normalized.id}__${normalized.src || ""}__${normalized.label}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(normalized);
  });

  return merged;
};

const normalizeStoreProductBackgroundOption = (
  product,
  index = 0,
  fallbackWidth = 815,
  fallbackHeight = 261,
) => {
  if (!product || typeof product !== "object") return null;

  let imageSrc = null;
  if (isSafeImageSrc(product.featured_image)) {
    imageSrc = product.featured_image;
  } else if (
    product.image &&
    typeof product.image === "object" &&
    isSafeImageSrc(product.image.src)
  ) {
    imageSrc = product.image.src;
  } else if (
    typeof product.image === "string" &&
    isSafeImageSrc(product.image)
  ) {
    imageSrc = product.image; // Support for Predictive Search API format
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    if (typeof firstImg === "string" && isSafeImageSrc(firstImg)) {
      imageSrc = firstImg;
    } else if (
      firstImg &&
      typeof firstImg === "object" &&
      isSafeImageSrc(firstImg.src)
    ) {
      imageSrc = firstImg.src;
    }
  }

  if (!imageSrc) return null;

  const firstVariant = Array.isArray(product.variants)
    ? product.variants.find((variant) => parsePositiveVariantId(variant?.id))
    : null;

  return {
    id: `store_bg_${product.handle || index}`,
    label: String(product.title || `Product ${index + 1}`),
    src: imageSrc,
    color: "#ffffff",
    width: Math.max(1, safeNum(product.featured_image?.width, fallbackWidth)),
    height: Math.max(
      1,
      safeNum(product.featured_image?.height, fallbackHeight),
    ),
    locked: true,
    productHandle: String(product.handle || ""),
    productTitle: String(product.title || ""),
    productVariantId: parsePositiveVariantId(firstVariant?.id),
    vendor: String(product.vendor || ""),
    productType: String(product.product_type || ""),
  };
};

const fetchShopifyCollections = async ({ timeoutMs = 10000 } = {}) => {
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    const response = await fetch(`/collections.json?limit=250`, {
      headers: { Accept: "application/json" },
      signal: controller ? controller.signal : undefined,
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error("Failed to load collections.");
    }

    const payload = await response.json();
    const collections = Array.isArray(payload?.collections)
      ? payload.collections
      : [];

    // Filter out specific collections as requested by the user
    const excludedTitles = ["retee", "led party glasses", "party glasses"];
    return collections.filter((c) => {
      const title = String(c.title || "")
        .trim()
        .toLowerCase();
      return !excludedTitles.includes(title);
    });
  } catch (error) {
    if (
      error &&
      (error.name === "AbortError" || /aborted|timeout/i.test(String(error)))
    ) {
      throw new Error("Loading collections timed out.");
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const fetchStoreProductBackgroundOptions = async ({
  timeoutMs = 15000,
  collectionHandle = "all",
} = {}) => {
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    const handle = String(collectionHandle || "").trim() || "all";
    const queryTerm = handle === "all" ? "tudiwrap" : handle;
    const searchUrl = `/search/suggest.json?q=${encodeURIComponent(queryTerm)}&resources[type]=product&resources[limit]=100`;

    const response = await fetch(searchUrl, {
      headers: { Accept: "application/json" },
      signal: controller ? controller.signal : undefined,
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error("Failed to load templates via Search API.");
    }

    const payload = await response.json();
    const products = payload?.resources?.results?.products || [];

    if (products.length === 0) {
      throw new Error("No templates found in this collection.");
    }

    const normalized = products
      .map((product, index) =>
        normalizeStoreProductBackgroundOption(product, index),
      )
      .filter(Boolean);

    if (normalized.length === 0) {
      throw new Error("Templates exist but missing valid images.");
    }

    return normalized.sort((a, b) => {
      const aVendor = String(a.vendor || "").toLowerCase();
      const bVendor = String(b.vendor || "").toLowerCase();
      const aScore = aVendor.includes("tudi") ? 1 : 0;
      const bScore = bVendor.includes("tudi") ? 1 : 0;
      return bScore - aScore;
    });
  } catch (error) {
    if (
      error &&
      (error.name === "AbortError" || /aborted|timeout/i.test(String(error)))
    ) {
      throw new Error("Loading product backgrounds timed out.");
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const safeClone = (obj) => {
  if (obj === undefined) return undefined;
  if (obj === null) return null;
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(obj);
    } catch (e) {
      // Fallback
    }
  }
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return obj;
  }
};

const getThemeBootstrapContextSignature = (bootstrap) => {
  const safeBootstrap =
    bootstrap && typeof bootstrap === "object" ? bootstrap : {};
  const variantId = String(safeBootstrap.variantId || "no-variant");
  const productHandle =
    slugify(String(safeBootstrap.productHandle || "no-product")) ||
    "no-product";
  const bgRef =
    safeBootstrap.background?.id ||
    safeBootstrap.background?.src ||
    safeBootstrap.background?.label ||
    safeBootstrap.background?.color ||
    "no-background";

  return `v_${variantId}__p_${productHandle}__b_${hashString(bgRef)}`;
};

const getThemeBootstrap = () => {
  if (typeof window === "undefined")
    return { variantId: null, productHandle: null, background: null };

  const windowBootstrap = window["__TUDIWRAP_EDITOR_BOOTSTRAP__"];
  const legacyThemeContext = window["TudiwrapThemeContext"];
  const rootEl =
    document.getElementById("tudiwrap-editor-root") ||
    document.querySelector("[data-tudiwrap-editor-root]");
  const data = rootEl?.dataset || {};
  const query = new URLSearchParams(window.location.search);

  const globalBootstrap = {
    ...(legacyThemeContext && typeof legacyThemeContext === "object"
      ? legacyThemeContext
      : {}),
    ...(windowBootstrap && typeof windowBootstrap === "object"
      ? windowBootstrap
      : {}),
  };

  const rawBackground =
    [windowBootstrap?.background, legacyThemeContext?.background].find(
      (candidate) => candidate && typeof candidate === "object",
    ) || null;

  const backgroundId =
    rawBackground?.id ||
    globalBootstrap.backgroundId ||
    data.backgroundId ||
    query.get("backgroundId") ||
    null;
  const backgroundLabel =
    rawBackground?.label ||
    globalBootstrap.backgroundLabel ||
    data.backgroundLabel ||
    data.background_label ||
    query.get("backgroundLabel") ||
    query.get("background_label") ||
    null;
  const backgroundSrc =
    rawBackground?.src ||
    globalBootstrap.backgroundSrc ||
    data.backgroundSrc ||
    data.background ||
    query.get("backgroundSrc") ||
    query.get("background") ||
    null;
  const backgroundColor =
    rawBackground?.color ||
    globalBootstrap.backgroundColor ||
    data.backgroundColor ||
    query.get("backgroundColor") ||
    query.get("background_color") ||
    null;
  const backgroundWidth =
    rawBackground?.width ??
    globalBootstrap.backgroundWidth ??
    data.backgroundWidth;
  const backgroundHeight =
    rawBackground?.height ??
    globalBootstrap.backgroundHeight ??
    data.backgroundHeight;

  const background =
    backgroundId || backgroundSrc || backgroundColor
      ? {
          id: String(backgroundId || "bg_base"),
          label: String(backgroundLabel || "Background"),
          src: isSafeImageSrc(backgroundSrc) ? backgroundSrc : null,
          color: normalizeHexColor(backgroundColor, "#ffffff"),
          width: Math.max(1, safeNum(backgroundWidth, 815)),
          height: Math.max(1, safeNum(backgroundHeight, 261)),
          locked: true,
        }
      : null;

  const backgroundOptions = mergeBackgroundOptions(
    background ? [background] : [],
    parseBootstrapBackgroundOptions(globalBootstrap.backgroundOptions),
    parseBootstrapBackgroundOptions(data.backgroundOptions),
    parseBootstrapBackgroundOptions(data.background_options),
    parseBootstrapBackgroundOptions(query.get("backgroundOptions")),
    parseBootstrapBackgroundOptions(query.get("background_options")),
  );

  return {
    variantId:
      globalBootstrap.variantId ||
      data.variantId ||
      query.get("variant") ||
      query.get("variantId") ||
      query.get("id") ||
      null,
    sourceVariantId:
      globalBootstrap.variantId ||
      data.variantId ||
      query.get("variant") ||
      query.get("variantId") ||
      query.get("id") ||
      null,
    productHandle:
      globalBootstrap.productHandle ||
      data.productHandle ||
      query.get("product") ||
      query.get("productHandle") ||
      null,
    sourceProductHandle:
      globalBootstrap.productHandle ||
      data.productHandle ||
      query.get("product") ||
      query.get("productHandle") ||
      null,
    cartVariantId:
      globalBootstrap.cartVariantId ||
      globalBootstrap.customDesignVariantId ||
      globalBootstrap.customVariantId ||
      globalBootstrap.customOrderVariantId ||
      globalBootstrap.tudiCustomOrderVariantId ||
      data.cartVariantId ||
      data.customDesignVariantId ||
      data.customVariantId ||
      data.customOrderVariantId ||
      data.tudiCustomOrderVariantId ||
      query.get("cartVariantId") ||
      query.get("customDesignVariantId") ||
      query.get("customVariantId") ||
      query.get("customOrderVariantId") ||
      query.get("tudiCustomOrderVariantId") ||
      query.get("cart_variant") ||
      query.get("custom_design_variant") ||
      query.get("custom_order_variant") ||
      null,
    cartProductHandle:
      globalBootstrap.cartProductHandle ||
      globalBootstrap.customDesignProductHandle ||
      globalBootstrap.customProductHandle ||
      globalBootstrap.customOrderProductHandle ||
      globalBootstrap.tudiCustomOrderProductHandle ||
      data.cartProductHandle ||
      data.customDesignProductHandle ||
      data.customProductHandle ||
      data.customOrderProductHandle ||
      data.tudiCustomOrderProductHandle ||
      query.get("cartProductHandle") ||
      query.get("customDesignProductHandle") ||
      query.get("customProductHandle") ||
      query.get("customOrderProductHandle") ||
      query.get("tudiCustomOrderProductHandle") ||
      query.get("cart_product") ||
      query.get("custom_design_product") ||
      query.get("custom_order_product") ||
      null,
    forceDirectCart: [
      globalBootstrap.forceDirectCart,
      globalBootstrap.force_direct_cart,
      data.forceDirectCart,
      data.force_direct_cart,
      query.get("forceDirectCart"),
      query.get("force_direct_cart"),
    ].some(
      (value) =>
        String(value || "").toLowerCase() === "true" ||
        String(value || "") === "1",
    ),
    background,
    backgroundOptions,
  };
};

const getBackgroundCollectionLabel = (bootstrap) => {
  if (typeof window === "undefined") return "Tudiwrap";
  const query = new URLSearchParams(window.location.search);
  return (
    uniqueNonEmptyStrings([
      bootstrap?.backgroundCollectionLabel,
      bootstrap?.productBackgroundCollectionLabel,
      bootstrap?.collectionLabel,
      bootstrap?.sourceCollectionLabel,
      bootstrap?.productCollectionLabel,
      query.get("backgroundCollectionLabel"),
      query.get("productBackgroundCollectionLabel"),
      query.get("collectionLabel"),
      query.get("background_collection_label"),
      query.get("product_background_collection_label"),
      query.get("collection_label"),
      "Tudiwrap",
    ])[0] || "Tudiwrap"
  );
};

const DEFAULT_CUSTOM_ORDER_PRODUCT_HANDLE = "tudi-custom-order";

const parsePositiveVariantId = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const uniqueNonEmptyStrings = (values) => {
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const normalized = typeof value === "string" ? value.trim() : "";
    if (!normalized) return;
    if (seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });
  return result;
};

const buildCustomCartHandleCandidates = (
  bootstrap,
  sourceProductHandle = "",
) => {
  if (typeof window === "undefined")
    return uniqueNonEmptyStrings([DEFAULT_CUSTOM_ORDER_PRODUCT_HANDLE]);

  const query = new URLSearchParams(window.location.search);
  const sourceHandle = String(sourceProductHandle || "").trim();

  return uniqueNonEmptyStrings(
    [
      bootstrap?.cartProductHandle,
      bootstrap?.customProductHandle,
      bootstrap?.customDesignProductHandle,
      bootstrap?.customOrderProductHandle,
      bootstrap?.tudiCustomOrderProductHandle,
      query.get("cartProductHandle"),
      query.get("customProductHandle"),
      query.get("customDesignProductHandle"),
      query.get("customOrderProductHandle"),
      query.get("tudiCustomOrderProductHandle"),
      query.get("cart_product"),
      query.get("custom_product"),
      query.get("custom_design_product"),
      query.get("custom_order_product"),
      DEFAULT_CUSTOM_ORDER_PRODUCT_HANDLE,
    ].filter(
      (handle) =>
        String(handle || "").trim() &&
        String(handle || "").trim() !== sourceHandle,
    ),
  );
};

const fetchShopifyProductByHandle = async (handle) => {
  const normalizedHandle = String(handle || "").trim();
  if (!normalizedHandle) return null;

  const safeHandle = encodeURIComponent(normalizedHandle);
  const response = await fetch(`/products/${safeHandle}.js`, {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load Shopify product JSON for ${normalizedHandle}.`,
    );
  }
  const product = await response.json();
  if (!product || typeof product !== "object") return null;
  return product;
};

const resolveShopifySourceVariantId = () => {
  if (typeof window === "undefined") return null;

  const bootstrap = getThemeBootstrap();
  const formInput =
    document.querySelector('form[action*="/cart/add"] [name="id"]') ||
    document.querySelector('[name="id"]');
  const formValue =
    formInput?.value ||
    formInput?.getAttribute("value") ||
    document
      .querySelector("[data-variant-id]")
      ?.getAttribute("data-variant-id");

  const candidates = [
    formValue,
    bootstrap.variantId,
    new URLSearchParams(window.location.search).get("variant"),
    new URLSearchParams(window.location.search).get("variantId"),
  ];

  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return null;
};

const resolveShopifyCartVariantId = () => {
  if (typeof window === "undefined") return null;

  const bootstrap = getThemeBootstrap();
  const sourceVariantId = resolveShopifySourceVariantId();
  const query = new URLSearchParams(window.location.search);

  const sourceProductHandle = slugify(
    String(
      bootstrap.sourceProductHandle ||
        bootstrap.productHandle ||
        query.get("product") ||
        query.get("productHandle") ||
        "",
    ).trim(),
  );

  const explicitCartProductHandle = slugify(
    String(
      bootstrap.cartProductHandle ||
        bootstrap.customProductHandle ||
        bootstrap.customDesignProductHandle ||
        bootstrap.customOrderProductHandle ||
        bootstrap.tudiCustomOrderProductHandle ||
        query.get("cartProductHandle") ||
        query.get("customProductHandle") ||
        query.get("customDesignProductHandle") ||
        query.get("customOrderProductHandle") ||
        query.get("tudiCustomOrderProductHandle") ||
        "",
    ).trim(),
  );

  const customHandleCandidates = buildCustomCartHandleCandidates(
    bootstrap,
    sourceProductHandle,
  )
    .map((handle) => slugify(String(handle || "").trim()))
    .filter(Boolean);

  const sourceAlreadyCustomProduct = !!(
    sourceProductHandle &&
    (sourceProductHandle === explicitCartProductHandle ||
      customHandleCandidates.includes(sourceProductHandle))
  );

  if (sourceAlreadyCustomProduct) {
    return sourceVariantId;
  }

  const candidates = [
    bootstrap.cartVariantId,
    bootstrap.customDesignVariantId,
    bootstrap.customVariantId,
    bootstrap.customOrderVariantId,
    bootstrap.tudiCustomOrderVariantId,
    query.get("cartVariantId"),
    query.get("customDesignVariantId"),
    query.get("customVariantId"),
    query.get("customOrderVariantId"),
    query.get("tudiCustomOrderVariantId"),
    query.get("cart_variant"),
    query.get("custom_design_variant"),
    query.get("custom_order_variant"),
  ];

  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return null;
};

const isPlaceholderBackground = (background) => {
  if (!background || typeof background !== "object") return true;
  const normalizedId = String(background.id || "")
    .trim()
    .toLowerCase();
  if (!normalizedId) return true;
  if (normalizedId === "none") return true;
  if (PLACEHOLDER_BACKGROUND_IDS.has(normalizedId) && !background.src)
    return true;
  return false;
};

const sanitizeSnapshotObject = (element) => {
  const safeEl = validateElement(element, String(element?.id || "el_invalid"));
  if (!safeEl) return null;

  const hasLocalCoords =
    typeof element?.localX !== "undefined" ||
    typeof element?.localY !== "undefined";

  const base = {
    id: safeEl.id,
    type: safeEl.type,
    x: safeNum(safeEl.x, 0),
    y: safeNum(safeEl.y, 0),
    width: Math.max(1, safeNum(safeEl.width, 1)),
    height: Math.max(1, safeNum(safeEl.height, 1)),
    rotation: safeNum(safeEl.rotation, 0),
    visible: safeEl.visible !== false,
    locked: !!safeEl.locked,
    opacity: Math.max(0, Math.min(1, safeNum(safeEl.opacity, 1))),
    color: normalizeHexColor(safeEl.color, "#000000"),
    fillType: safeEl.fillType === "gradient" ? "gradient" : "solid",
    gradientColor2: normalizeHexColor(safeEl.gradientColor2, "#ffffff"),
    gradientAngle: safeNum(safeEl.gradientAngle, 90),
    strokes: Array.isArray(safeEl.strokes)
      ? safeEl.strokes.map(validateStroke).filter(Boolean).slice(0, 3)
      : [],
    ...(hasLocalCoords
      ? {
          localX: safeNum(safeEl.localX, 0),
          localY: safeNum(safeEl.localY, 0),
        }
      : {}),
  };

  if (safeEl.type === "text") {
    return {
      ...base,
      content: String(safeEl.content || ""),
      fontSize: Math.max(1, safeNum(safeEl.fontSize, 32)),
      fontFamily: String(safeEl.fontFamily || "Inter"),
      textAlign: safeEl.textAlign || "left",
      warpStyle: safeEl.warpStyle || "none",
      warpBend: safeNum(safeEl.warpBend, 0),
      warpDistortH: safeNum(safeEl.warpDistortH, 0),
      warpDistortV: safeNum(safeEl.warpDistortV, 0),
      scaleX: Math.max(0.01, safeNum(safeEl.scaleX, 1)),
      scaleY: Math.max(0.01, safeNum(safeEl.scaleY, 1)),
      letterSpacing: safeNum(safeEl.letterSpacing, 0),
      lineHeight: Math.max(0.1, safeNum(safeEl.lineHeight, 1.2)),
      fontWeight: safeEl.fontWeight || "bold",
      fontStyle: safeEl.fontStyle || "normal",
      textTransform: safeEl.textTransform || "none",
      textDecoration: safeEl.textDecoration || "none",
    };
  }

  if (safeEl.type === "image") {
    const src = sanitizeCartImageSrc(safeEl.src);
    const sourceType = src
      ? "persistent"
      : isTransientImageSrc(safeEl.src)
        ? "session-only"
        : "missing";

    return { ...base, src, sourceType };
  }

  if (safeEl.type === "compound") {
    return {
      ...base,
      operation: safeEl.operation || "union",
      sourceOperation: safeEl.sourceOperation || safeEl.operation || "union",
      originalWidth: Math.max(1, safeNum(safeEl.originalWidth, safeEl.width)),
      originalHeight: Math.max(
        1,
        safeNum(safeEl.originalHeight, safeEl.height),
      ),
      children: Array.isArray(safeEl.children)
        ? safeEl.children.map(sanitizeSnapshotObject).filter(Boolean)
        : [],
    };
  }

  return {
    ...base,
    borderRadius: Math.max(0, safeNum(safeEl.borderRadius, 0)),
    points: safeEl.points,
    customPoints: Array.isArray(safeEl.customPoints)
      ? safeEl.customPoints.map((point) => ({
          x: safeNum(point.x, 0),
          y: safeNum(point.y, 0),
        }))
      : undefined,
  };
};

const buildTudiDesignSnapshot = ({
  elements,
  background,
  artboardW = 815,
  artboardH = 261,
}) => {
  const objects = Array.isArray(elements)
    ? elements.map(sanitizeSnapshotObject).filter(Boolean)
    : [];
  const sanitizedBackground = {
    id: String(background?.id || "bg_base"),
    label: String(background?.label || "Background"),
    color: normalizeHexColor(background?.color, "#ffffff"),
    src: sanitizeCartImageSrc(background?.src),
    width: Math.max(1, safeNum(background?.width, artboardW)),
    height: Math.max(1, safeNum(background?.height, artboardH)),
  };

  const textObjectCount = objects.filter((obj) => obj.type === "text").length;
  const imageObjectCount = objects.filter((obj) => obj.type === "image").length;
  const sessionOnlyImageCount = objects.filter(
    (obj) => obj.type === "image" && obj.sourceType === "session-only",
  ).length;
  const hasTextDistortion = objects.some(
    (obj) => obj.type === "text" && obj.warpStyle && obj.warpStyle !== "none",
  );

  return {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    canvas: { width: artboardW, height: artboardH },
    background: sanitizedBackground,
    objects,
    zOrder: objects.map((obj) => obj.id),
    summary: {
      objectCount: objects.length,
      textObjectCount,
      imageObjectCount,
      sessionOnlyImageCount,
      hasTextDistortion,
    },
    timestamp: new Date().toISOString(),
  };
};

const validateDesignDocumentForAddToCart = ({
  elements,
  background,
  variantId,
}) => {
  const errors = [];

  if (!Number.isFinite(Number(variantId)) || Number(variantId) <= 0) {
    errors.push("Invalid or missing Shopify Variant ID.");
  }

  if (isPlaceholderBackground(background)) {
    errors.push("Please select a real product background before Add to Cart.");
  }

  if (
    Array.isArray(elements) &&
    elements.some(
      (element) =>
        Array.isArray(element?.strokes) && element.strokes.length > 3,
    )
  ) {
    errors.push("Maximum of 3 strokes allowed per object.");
  }

  if (
    Array.isArray(elements) &&
    elements.some(
      (element) => element?.type === "image" && !isSafeImageSrc(element?.src),
    )
  ) {
    errors.push("One or more image objects are missing a valid source.");
  }

  return { ok: errors.length === 0, errors };
};

const buildShopifyCartPayload = ({
  cartVariantId,
  sourceVariantId,
  sourceProductHandle,
  cartProductHandle,
  snapshot,
  previewDataUrl = null,
  pricingModeOverride = null,
}) => {
  const sessionOnlyNote =
    snapshot.summary.sessionOnlyImageCount > 0
      ? `, ${snapshot.summary.sessionOnlyImageCount} local image source omitted from cart snapshot`
      : "";
  const computedPricingMode =
    Number(cartVariantId) &&
    Number(sourceVariantId) &&
    Number(cartVariantId) !== Number(sourceVariantId)
      ? "custom-design-product"
      : "source-product";
  const pricingMode = pricingModeOverride || computedPricingMode;
  const summaryText = `${snapshot.summary.objectCount} design objects, Background: ${snapshot.background.label || snapshot.background.color || "Custom"}${sessionOnlyNote}`;

  const properties = {
    _tudi_schema_version: snapshot.schemaVersion,
    _tudi_editor_version: EDITOR_BUILD_VERSION,
    _tudi_pricing_mode: pricingMode,
    _tudi_source_variant_id: sourceVariantId ? String(sourceVariantId) : "",
    _tudi_source_product_handle: String(sourceProductHandle || ""),
    _tudi_cart_variant_id: cartVariantId ? String(cartVariantId) : "",
    _tudi_cart_product_handle: String(cartProductHandle || ""),
    _tudi_background_id: String(snapshot.background.id || ""),
    _tudi_background_label: String(snapshot.background.label || "Untitled"),
    _tudi_object_count: String(snapshot.summary.objectCount || 0),
    _tudi_has_text_distortion: snapshot.summary.hasTextDistortion
      ? "true"
      : "false",
    _tudi_summary: summaryText,
    _tudi_design_snapshot: JSON.stringify(snapshot),
    ...(previewDataUrl
      ? {
          _tudi_preview_data_url: previewDataUrl,
          _tudi_preview_format: "image/jpeg",
        }
      : {}),
  };

  return {
    payload: {
      items: [{ id: Number(cartVariantId), quantity: 1, properties }],
    },
    properties,
    pricingMode,
    summaryText,
  };
};

// --- UI HELPER COMPONENTS (Top-level to prevent unmounting crashes) ---

const CustomIntegratedPicker = ({ activeColor, onColorChange }) => {
  const [hsv, setHsv] = useState(() => hexToHsv(activeColor || "#4B00FF"));
  const satRef = useRef(null);
  const hueRef = useRef(null);

  useEffect(() => {
    const newHsv = hexToHsv(activeColor);
    if (
      Math.round(newHsv.h) !== Math.round(hsv.h) ||
      Math.round(newHsv.s) !== Math.round(hsv.s) ||
      Math.round(newHsv.v) !== Math.round(hsv.v)
    ) {
      setHsv(newHsv);
    }
  }, [activeColor]);

  const handleSatMove = useCallback(
    (e) => {
      if (!satRef.current) return;
      const rect = satRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newHsv = { ...hsv, s: x * 100, v: (1 - y) * 100 };
      setHsv(newHsv);
      onColorChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    },
    [hsv, onColorChange],
  );

  const handleHueMove = useCallback(
    (e) => {
      if (!hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newHsv = { ...hsv, h: x * 360 };
      setHsv(newHsv);
      onColorChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    },
    [hsv, onColorChange],
  );

  const startSatDrag = (e) => {
    handleSatMove(e);
    const move = (me) => handleSatMove(me);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startHueDrag = (e) => {
    handleHueMove(e);
    const move = (me) => handleHueMove(me);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="space-y-4">
      <div
        ref={satRef}
        onPointerDown={startSatDrag}
        className="relative w-full h-32 rounded-lg cursor-crosshair overflow-hidden border border-white/10 shadow-inner"
        style={{ backgroundColor: hsvToHex(hsv.h, 100, 100) }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div
          className="absolute w-3 h-3 border-2 border-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
        />
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg border border-white/10 shadow-lg"
          style={{ backgroundColor: activeColor }}
        />
        <div
          ref={hueRef}
          onPointerDown={startHueDrag}
          className="relative flex-1 h-3 rounded-full cursor-pointer border border-white/5"
          style={{
            background:
              "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          }}
        >
          <div
            className="absolute w-4 h-4 bg-white border border-slate-400 rounded-full shadow-md -top-0.5 -translate-x-1/2 pointer-events-none"
            style={{ left: `${(hsv.h / 360) * 100}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(() => {
          const rgb = hexToRgb(activeColor);
          return ["r", "g", "b"].map((key) => (
            <div key={key} className="flex flex-col gap-1 items-center">
              <input
                type="number"
                min="0"
                max="255"
                value={rgb[key]}
                onChange={(e) => {
                  const val = Math.max(
                    0,
                    Math.min(255, parseInt(e.target.value) || 0),
                  );
                  const newRgb = { ...rgb, [key]: val };
                  const toHex = (x) => {
                    const h = x.toString(16);
                    return h.length === 1 ? "0" + h : h;
                  };
                  onColorChange(
                    `#${toHex(newRgb.r)}${toHex(newRgb.g)}${toHex(newRgb.b)}`,
                  );
                }}
                className="w-full bg-slate-800 text-white text-[10px] text-center p-1.5 rounded border border-slate-700 outline-none focus:border-indigo-500"
              />
              <span className="text-[8px] font-bold text-slate-500 uppercase">
                {key}
              </span>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

const ColorEditorArea = ({
  activeColor,
  onColorChange,
  editId,
  activeColorEditId,
  pickerTab,
  setPickerTab,
  activateEyedropper,
}) => {
  const isVisible = activeColorEditId === editId;

  useEffect(() => {
    if (isVisible) {
      const pickerElement = document.getElementById(`picker-${editId}`);
      if (pickerElement)
        pickerElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isVisible, editId]);

  if (!isVisible) return null;

  return (
    <div
      id={`picker-${editId}`}
      className="mt-2 animate-in fade-in slide-in-from-top-1"
    >
      <div className="flex bg-slate-900/50 rounded-lg p-0.5 mb-2 border border-slate-800">
        <button
          onClick={() => setPickerTab("swatches")}
          className={`flex-1 py-1 text-[9px] font-black rounded uppercase tracking-wider transition-all duration-300 ${pickerTab === "swatches" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
        >
          Swatches
        </button>
        <button
          onClick={() => setPickerTab("color")}
          className={`flex-1 py-1 text-[9px] font-black rounded uppercase tracking-wider transition-all duration-300 ${pickerTab === "color" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
        >
          Picker
        </button>
      </div>

      {pickerTab === "swatches" ? (
        <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-[1px] bg-slate-900 p-1 rounded-lg">
          {ILLUSTRATOR_SWATCHES.map((color, idx) => (
            <button
              key={`${color}-${idx}`}
              onClick={() => onColorChange(color)}
              className={`aspect-square w-full rounded-[1px] transition-transform active:scale-90 relative ${(activeColor || "").toLowerCase() === color.toLowerCase() ? "ring-1 ring-white z-10 scale-110 shadow-md" : "hover:scale-110 hover:z-20"}`}
              style={{ backgroundColor: color }}
              title={color}
            ></button>
          ))}
        </div>
      ) : (
        <div className="space-y-3 bg-slate-900 p-2 rounded-lg border border-slate-800">
          <CustomIntegratedPicker
            activeColor={activeColor}
            onColorChange={onColorChange}
          />
          <div className="flex gap-2 items-center pt-2 border-t border-slate-800">
            <span className="text-[9px] font-mono text-slate-500 uppercase">
              HEX
            </span>
            <input
              type="text"
              value={(activeColor || "").toUpperCase()}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(val)) onColorChange(val);
              }}
              className="bg-slate-800 text-white font-mono text-[10px] px-2 py-1 rounded flex-1 outline-none focus:border-indigo-500"
            />
            <button
              onClick={activateEyedropper}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-indigo-400"
            >
              <Pipette size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message:
        error instanceof Error ? error.message : "Editor failed to render.",
    };
  }

  componentDidCatch(error, info) {
    console.error("TUDIwrap editor render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-[#0a0f1d] text-slate-200 flex items-start justify-start p-8">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 max-w-md shadow-2xl">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300 mb-2">
              Editor Error
            </div>
            <div className="text-sm font-bold text-white mb-2">
              The custom design editor failed to render.
            </div>
            <div className="text-xs text-slate-300 leading-5">
              {this.state.message || "Unknown render error."}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const ARTBOARD_W = 815,
    ARTBOARD_H = 261,
    GUIDE1_W = 686.5,
    GUIDE1_H = 228.5,
    GUIDE2_W = 216.5,
    GUIDE2_H = 180;

  const themeBootstrapRef = useRef(getThemeBootstrap());
  const bootBackgroundRef = useRef(
    themeBootstrapRef.current?.background
      ? safeClone({ ...themeBootstrapRef.current.background, locked: true })
      : null,
  );
  const editorContextSignatureRef = useRef(
    getThemeBootstrapContextSignature(themeBootstrapRef.current),
  );
  const projectStorageKeyRef = useRef(
    buildProjectStorageKey(editorContextSignatureRef.current),
  );
  const initialProjectRef = useRef(null);
  if (initialProjectRef.current === null) {
    const loadedProject = loadValidatedProjectData(
      projectStorageKeyRef.current,
      ARTBOARD_W,
      ARTBOARD_H,
      editorContextSignatureRef.current,
    );
    const bootBackground = themeBootstrapRef.current?.background;

    initialProjectRef.current = bootBackground
      ? {
          ...loadedProject,
          background: {
            ...loadedProject.background,
            ...bootBackground,
            locked: true,
          },
        }
      : loadedProject;
  }

  const [elements, setElements] = useState(
    () => initialProjectRef.current.elements,
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("props");
  const [activeTool, setActiveTool] = useState("select");
  const [zoom, setZoom] = useState(0.8);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // Canvas pan offset
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [background, setBackground] = useState(
    () => initialProjectRef.current.background,
  );
  const [backgroundOptions, setBackgroundOptions] = useState(() =>
    mergeBackgroundOptions(
      bootBackgroundRef.current ? [bootBackgroundRef.current] : [],
      themeBootstrapRef.current?.backgroundOptions || [],
      initialProjectRef.current?.background
        ? [initialProjectRef.current.background]
        : [],
    ),
  );
  const [shopCollections, setShopCollections] = useState([]);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [activeTemplateView, setActiveTemplateView] = useState("collections"); // 'collections' or 'products'
  const [showProductBackgroundBrowser, setShowProductBackgroundBrowser] =
    useState(false);
  const [
    isLoadingProductBackgroundOptions,
    setIsLoadingProductBackgroundOptions,
  ] = useState(false);
  const [productBackgroundError, setProductBackgroundError] = useState("");
  const initialSourceProductHandle = slugify(
    String(themeBootstrapRef.current?.productHandle || ""),
  );
  const initialResolvedCartHandle = slugify(
    String(
      themeBootstrapRef.current?.cartProductHandle ||
        DEFAULT_CUSTOM_ORDER_PRODUCT_HANDLE,
    ),
  );
  const sourceAlreadyCustomProduct = !!(
    initialSourceProductHandle &&
    initialResolvedCartHandle &&
    initialSourceProductHandle === initialResolvedCartHandle
  );
  const [resolvedCartVariantId, setResolvedCartVariantId] = useState(() =>
    parsePositiveVariantId(themeBootstrapRef.current?.cartVariantId),
  );
  const [resolvedCartProductHandle, setResolvedCartProductHandle] = useState(
    () => {
      const initialHandle = String(
        themeBootstrapRef.current?.cartProductHandle || "",
      ).trim();
      return initialHandle || null;
    },
  );
  const [isResolvingCartVariant, setIsResolvingCartVariant] = useState(false);
  const mobileShift = false;
  const [marquee, setMarquee] = useState(null);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const customCartVariantConfigured =
    sourceAlreadyCustomProduct ||
    (Number.isFinite(Number(resolvedCartVariantId)) &&
      Number(resolvedCartVariantId) > 0);
  const [currentShape, setCurrentShape] = useState("rect");
  const [statusMsg, setStatusMsg] = useState(""); // Toast status message
  const [submitStatus, setSubmitStatus] = useState("idle");
  const lastCartDebugRef = useRef(null);

  const saveToHistory = useCallback((newElements, newBackground) => {
    const elementsSource =
      typeof newElements !== "undefined" ? newElements : elementsRef.current;
    const backgroundSource =
      typeof newBackground !== "undefined"
        ? newBackground
        : backgroundRef.current;

    const cleanElements = safeClone(elementsSource);
    const cleanBackground = safeClone(backgroundSource);
    const nextEntry = { elements: cleanElements, background: cleanBackground };

    const currentHead = historyRef.current[historyIndexRef.current];
    if (currentHead) {
      const currentSerialized = JSON.stringify(currentHead);
      const nextSerialized = JSON.stringify(nextEntry);
      if (currentSerialized === nextSerialized) return;
    }

    const nextHistory = historyRef.current.slice(
      0,
      historyIndexRef.current + 1,
    );
    nextHistory.push(nextEntry);

    const trimmedHistory = nextHistory.slice(-20);
    const nextIndex = trimmedHistory.length - 1;

    historyRef.current = trimmedHistory;
    historyIndexRef.current = nextIndex;
    setHistory(trimmedHistory);
    setHistoryIndex(nextIndex);
  }, []);

  const applyElementsUpdate = useCallback(
    (updater, options = {}) => {
      const { saveHistory = true } = options;
      const currentElements = elementsRef.current;
      const nextElements =
        typeof updater === "function" ? updater(currentElements) : updater;

      elementsRef.current = nextElements;
      setElements(nextElements);

      if (saveHistory) {
        saveToHistory(nextElements, backgroundRef.current);
      }

      return nextElements;
    },
    [saveToHistory],
  );

  // --- FABRIC.JS INTEGRATION ---
  const fabricCanvasRef = useRef(null);
  const syncLockRef = useRef(false); // Prevents infinite loops between React and Fabric

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: ARTBOARD_W,
      height: ARTBOARD_H,
      backgroundColor: "transparent",
      preserveObjectStacking: true,
      selection: true,
      uniformScaling: false,
    });

    fabricCanvasRef.current = canvas;

    // ----------------------------------------------------
    // FABRIC -> REACT SYNC (Listen to user interactions on canvas)
    // ----------------------------------------------------

    const handleObjectModified = (e) => {
      if (syncLockRef.current) return;
      const target = e.target;
      if (!target) return;

      syncLockRef.current = true;

      const updates = {};
      if (target.type === "activeSelection") {
        // Handle multi-select modification (optional phase 2)
      } else {
        const id = target.id;
        updates.x = target.left;
        updates.y = target.top;
        updates.rotation = target.angle || 0;

        // Fabric scales objects, but React state expects width/height changes for shapes
        // Text requires scaleX/scaleY in React state as per existing logic
        if (target.type === "i-text" || target.type === "text") {
          updates.scaleX = target.scaleX;
          updates.scaleY = target.scaleY;
          updates.width = target.width; // update width too to avoid jumping
        } else {
          updates.width = target.width * target.scaleX;
          updates.height = target.height * target.scaleY;
          // reset scale in fabric so width/height take over
          target.set({
            width: updates.width,
            height: updates.height,
            scaleX: 1,
            scaleY: 1,
          });
        }

        applyElementsUpdate((prev) =>
          prev.map((el) => (el.id === id ? { ...el, ...updates } : el)),
        );
      }

      setTimeout(() => (syncLockRef.current = false), 10);
    };

    const handleSelectionCreated = (e) => {
      if (syncLockRef.current) return;
      const selected = e.selected || [];
      const ids = selected.map((obj) => obj.id).filter(Boolean);
      setSelectedIds(ids);
    };

    const handleSelectionCleared = () => {
      if (syncLockRef.current) return;
      setSelectedIds([]);
    };

    canvas.on("object:modified", handleObjectModified);
    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off("object:modified");
        fabricCanvasRef.current.off("selection:created");
        fabricCanvasRef.current.off("selection:updated");
        fabricCanvasRef.current.off("selection:cleared");
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [ARTBOARD_W, ARTBOARD_H, applyElementsUpdate]); // Intentionally not re-running on state changes.

  // ----------------------------------------------------
  // REACT -> FABRIC SYNC (Listen to React state changes and draw to canvas)
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || syncLockRef.current) return;

    syncLockRef.current = true;

    // Create a map of existing fabric objects
    const existingObjects = canvas.getObjects().reduce((acc, obj) => {
      if (obj.id) acc[obj.id] = obj;
      return acc;
    }, {});

    let needsRender = false;

    // Sync Background
    const bgStr = background?.src || background?.color;
    if (bgStr) {
      if (background.src) {
        fabric.Image.fromURL(
          background.src,
          (img) => {
            // Fit image to canvas width/height preserving aspect ratio
            const scale = Math.max(
              ARTBOARD_W / img.width,
              ARTBOARD_H / img.height,
            );
            img.set({
              originX: "center",
              originY: "center",
              left: ARTBOARD_W / 2,
              top: ARTBOARD_H / 2,
              scaleX: scale,
              scaleY: scale,
            });
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          },
          { crossOrigin: "anonymous" },
        );
      } else if (background.color) {
        canvas.setBackgroundColor(
          background.color,
          canvas.renderAll.bind(canvas),
        );
      }
    } else {
      canvas.setBackgroundColor("transparent", canvas.renderAll.bind(canvas));
    }

    // Sync Elements
    const currentZIndexMap = elements.map((el) => el.id);

    elements.forEach((el, index) => {
      let fabObj = existingObjects[el.id];
      const isSelected = selectedIds.includes(el.id);

      const commonProps = {
        id: el.id,
        left: el.x,
        top: el.y,
        angle: el.rotation || 0,
        opacity: el.opacity !== undefined ? el.opacity : 1,
        fill: el.fillType === "gradient" ? el.color : el.color || "#000000", // Fallback solid color for gradient for now
        visible: el.visible !== false,
        selectable: !el.locked,
        evented: !el.locked,
        originX: "left",
        originY: "top",
        // Note: Triple Strokes disabled for phase 1
        stroke:
          el.strokes && el.strokes.length > 0 ? el.strokes[0].color : null,
        strokeWidth:
          el.strokes && el.strokes.length > 0 ? el.strokes[0].width : 0,
      };

      if (!fabObj) {
        // Create new object
        if (el.type === "rect") {
          fabObj = new fabric.Rect({
            ...commonProps,
            width: el.width,
            height: el.height,
            rx: el.borderRadius,
            ry: el.borderRadius,
          });
        } else if (el.type === "circle") {
          fabObj = new fabric.Ellipse({
            ...commonProps,
            rx: el.width / 2,
            ry: el.height / 2,
          });
        } else if (el.type === "triangle") {
          fabObj = new fabric.Triangle({
            ...commonProps,
            width: el.width,
            height: el.height,
          });
        } else if (el.type === "line") {
          fabObj = new fabric.Line(
            [0, el.height / 2, el.width, el.height / 2],
            {
              ...commonProps,
              stroke: el.color,
              strokeWidth: Math.max(2, el.height),
            },
          );
        } else if (el.type === "text") {
          fabObj = new fabric.IText(el.content || "", {
            ...commonProps,
            fontFamily: el.fontFamily || "Inter",
            fontSize: el.fontSize || 32,
            fontWeight: el.fontWeight || "bold",
            fontStyle: el.fontStyle || "normal",
            textAlign: el.textAlign || "left",
            underline: el.textDecoration === "underline",
            scaleX: el.scaleX || 1,
            scaleY: el.scaleY || 1,
          });

          // IText specific event for editing text
          fabObj.on("changed", function () {
            if (syncLockRef.current) return;
            syncLockRef.current = true;
              const textVal = this.text;
              applyElementsUpdate(prev => prev.map(item => item.id === el.id ? { ...item, content: textVal } : item));
            setTimeout(() => (syncLockRef.current = false), 10);
          });
        } else if (el.type === "image") {
          // Temporary placeholder, load image async
          fabObj = new fabric.Rect({
            ...commonProps,
            width: el.width,
            height: el.height,
            fill: "#cccccc",
          });
          fabric.Image.fromURL(
            el.src,
            (img) => {
              img.set({ ...commonProps, width: el.width, height: el.height });
              canvas.remove(fabObj);
              canvas.add(img);
              canvas.moveTo(img, index);
              canvas.renderAll();
            },
            { crossOrigin: "anonymous" },
          );
        } else {
          // Fallback for custom shapes (Star, Heart, etc.) - rendered as Path if getShapePathData works, otherwise Rect
          const pathData = getShapePathData(el, el.width, el.height);
          if (pathData) {
            fabObj = new fabric.Path(pathData, commonProps);
          } else {
            fabObj = new fabric.Rect({
              ...commonProps,
              width: el.width,
              height: el.height,
            });
          }
        }

        if (fabObj) {
          canvas.add(fabObj);
          needsRender = true;
        }
      } else {
        // Update existing object properties
        if (el.type === "rect") {
          fabObj.set({
            ...commonProps,
            width: el.width,
            height: el.height,
            rx: el.borderRadius,
            ry: el.borderRadius,
          });
        } else if (el.type === "circle") {
          fabObj.set({ ...commonProps, rx: el.width / 2, ry: el.height / 2 });
        } else if (el.type === "text" && fabObj.type === "i-text") {
          fabObj.set({
            ...commonProps,
            text: el.content || "",
            fontFamily: el.fontFamily || "Inter",
            fontSize: el.fontSize || 32,
            fontWeight: el.fontWeight || "bold",
            fontStyle: el.fontStyle || "normal",
            textAlign: el.textAlign || "left",
            underline: el.textDecoration === "underline",
            scaleX: el.scaleX || 1,
            scaleY: el.scaleY || 1,
          });
        } else {
          // Generic update
          fabObj.set({ ...commonProps, width: el.width, height: el.height });
        }
        needsRender = true;
      }

      // Ensure z-index is correct
      canvas.moveTo(fabObj, index);

      // Maintain selection mapping
      if (isSelected && !canvas.getActiveObjects().includes(fabObj)) {
        // If we want multiple selection sync later, adjust here
        canvas.setActiveObject(fabObj);
      }
    });

    // Remove deleted elements
    Object.keys(existingObjects).forEach((id) => {
      if (!currentZIndexMap.includes(id)) {
        canvas.remove(existingObjects[id]);
        needsRender = true;
      }
    });

    if (needsRender) {
      canvas.renderAll();
    }

    syncLockRef.current = false;
  }, [elements, background, selectedIds, applyElementsUpdate]); // Note: We pass applyElementsUpdate safely

  const handleBackNavigation = useCallback(() => {
    if (typeof window === "undefined") return;

    const sourceHandle = String(
      themeBootstrapRef.current?.productHandle || "",
    ).trim();

    // Security Fix: Prevent path traversal and open redirect vulnerabilities during client-side navigation
    const safeFallbackProductUrl = sourceHandle
      ? `/products/${encodeURIComponent(sourceHandle)}`
      : "/collections/all";

    try {
      if (document.referrer) {
        const referrerUrl = new URL(document.referrer, window.location.origin);
        if (
          referrerUrl.origin === window.location.origin &&
          referrerUrl.pathname !== window.location.pathname
        ) {
          window.location.href = referrerUrl.href;
          return;
        }
      }
    } catch (error) {}

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = safeFallbackProductUrl;
  }, []);

  useEffect(() => {
    let canceled = false;

    const resolveCustomCartVariant = async () => {
      const bootstrap = themeBootstrapRef.current || getThemeBootstrap();
      const sourceVariantId = resolveShopifySourceVariantId();
      const bootCartVariantId = parsePositiveVariantId(bootstrap.cartVariantId);
      const bootCartHandle =
        String(bootstrap.cartProductHandle || "").trim() || null;
      const sourceHandle = slugify(
        String(
          bootstrap.sourceProductHandle || bootstrap.productHandle || "",
        ).trim(),
      );
      const customHandleCandidates = buildCustomCartHandleCandidates(
        bootstrap,
        sourceHandle,
      )
        .map((handle) => slugify(String(handle || "").trim()))
        .filter(Boolean);
      const sourceAlreadyCustom = !!(
        sourceHandle && customHandleCandidates.includes(sourceHandle)
      );

      if (sourceAlreadyCustom && sourceVariantId) {
        if (!canceled) {
          setResolvedCartVariantId(sourceVariantId);
          setResolvedCartProductHandle(sourceHandle || bootCartHandle || null);
        }
        return;
      }

      if (
        bootCartVariantId &&
        (!sourceVariantId ||
          Number(bootCartVariantId) !== Number(sourceVariantId))
      ) {
        if (!canceled) {
          setResolvedCartVariantId(bootCartVariantId);
          setResolvedCartProductHandle(bootCartHandle);
        }
        return;
      }

      const handleCandidates = buildCustomCartHandleCandidates(
        bootstrap,
        bootstrap.productHandle || "",
      );
      if (handleCandidates.length === 0) {
        if (!canceled) {
          setResolvedCartVariantId(bootCartVariantId);
          setResolvedCartProductHandle(bootCartHandle);
        }
        return;
      }

      if (!canceled) setIsResolvingCartVariant(true);

      for (const handle of handleCandidates) {
        try {
          const product = await fetchShopifyProductByHandle(handle);
          if (!product) continue;
          const variants = Array.isArray(product.variants)
            ? product.variants
            : [];
          const preferredVariant = variants.find((variant) =>
            parsePositiveVariantId(variant?.id),
          );
          const fetchedVariantId = parsePositiveVariantId(preferredVariant?.id);

          if (
            fetchedVariantId &&
            (!sourceVariantId ||
              Number(fetchedVariantId) !== Number(sourceVariantId))
          ) {
            if (!canceled) {
              setResolvedCartVariantId(fetchedVariantId);
              setResolvedCartProductHandle(String(product.handle || handle));
              setStatusMsg("");
            }
            return;
          }
        } catch (error) {}
      }

      if (!canceled) {
        setResolvedCartVariantId(bootCartVariantId);
        setResolvedCartProductHandle(
          bootCartHandle || handleCandidates[0] || null,
        );
      }
    };

    resolveCustomCartVariant().finally(() => {
      if (!canceled) setIsResolvingCartVariant(false);
    });

    return () => {
      canceled = true;
    };
  }, []);

  // States for Auto-Shrink Panels
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [activePropertyTab, setActivePropertyTab] = useState(null); // Tab spesifik yang terbuka di panel
  const [clearArmed, setClearArmed] = useState(false);

  // State for Tabbed Color Picker (Default to Swatches)
  const [activeColorEditId, setActiveColorEditId] = useState(null);
  const [pickerTab, setPickerTab] = useState("swatches"); // Default to swatches for quick access
  const canvasRef = useRef(null);
  const viewportRef = useRef(null); // Ref for the scrollable viewport
  const fileInputRef = useRef(null);
  const backgroundFileInputRef = useRef(null);
  const propsPanelRef = useRef(null);
  const dragInfo = useRef({
    ids: [],
    type: null,
    startX: 0,
    startY: 0,
    initialVals: {},
  });
  const elementsRef = useRef(elements);
  const historyRef = useRef(history);
  const historyIndexRef = useRef(historyIndex);
  const backgroundRef = useRef(background);
  const backgroundOptionsRef = useRef(backgroundOptions);

  useEffect(() => {
    backgroundRef.current = background;
  }, [background]);
  useEffect(() => {
    backgroundOptionsRef.current = backgroundOptions;
  }, [backgroundOptions]);

  const loadShopifyCollectionsList = useCallback(async () => {
    if (isLoadingProductBackgroundOptions) return;
    setIsLoadingProductBackgroundOptions(true);
    setProductBackgroundError("");

    try {
      const collections = await fetchShopifyCollections();
      setShopCollections(collections);
      setActiveTemplateView("collections");
    } catch (error) {
      setProductBackgroundError(
        error instanceof Error ? error.message : "Failed to load collections.",
      );
    } finally {
      setIsLoadingProductBackgroundOptions(false);
    }
  }, [isLoadingProductBackgroundOptions]);

  const fetchProductsByCollection = useCallback(async (collectionHandle) => {
    if (!collectionHandle) return;
    setIsLoadingProductBackgroundOptions(true);
    setProductBackgroundError("");
    setCollectionProducts([]);
    setActiveTemplateView("products");

    try {
      const fetchedOptions = await fetchStoreProductBackgroundOptions({
        collectionHandle: collectionHandle,
      });
      setCollectionProducts(fetchedOptions);
    } catch (error) {
      setProductBackgroundError(
        error instanceof Error
          ? error.message
          : "Failed to load products for this collection.",
      );
    } finally {
      setIsLoadingProductBackgroundOptions(false);
    }
  }, []);

  const openProductBackgroundBrowser = useCallback(() => {
    setShowProductBackgroundBrowser(true);
    setProductBackgroundError("");
    if (shopCollections.length === 0) {
      loadShopifyCollectionsList();
    } else {
      setActiveTemplateView("collections");
    }
  }, [shopCollections.length, loadShopifyCollectionsList]);

  useEffect(() => {
    const bootBackground = themeBootstrapRef.current?.background;
    const bootOptions = mergeBackgroundOptions(
      bootBackground ? [{ ...bootBackground, locked: true }] : [],
      themeBootstrapRef.current?.backgroundOptions || [],
    );

    if (bootOptions.length) {
      backgroundOptionsRef.current = bootOptions;
      setBackgroundOptions(bootOptions);
    }

    if (!bootBackground) return;

    const nextBackground = {
      ...backgroundRef.current,
      ...bootBackground,
      locked: true,
    };

    const sameBackground =
      JSON.stringify(backgroundRef.current) === JSON.stringify(nextBackground);
    if (sameBackground) return;

    backgroundRef.current = nextBackground;
    setBackground(nextBackground);
  }, []);

  const spaceDown = useRef(false); // Tracks if Space is held for panning
  const panStart = useRef(null); // Starting point for pan gesture
  const gestureRef = useRef({
    pointers: new Map(),
    lastDist: null,
    lastMid: null,
  });

  const selectedIdsCount = selectedIds.length;
  const selectedElement =
    selectedIdsCount === 1
      ? elements.find((el) => el.id === selectedIds[0])
      : null;
  // Bug 6 fix: use lookup map so new shape types don't fall back to TriangleIcon

  // --- EDITOR LOGIC ---

  // Bug 12 fix: split font injection (empty deps) from statusMsg timer
  useEffect(() => {
    const FONT_LINK_ID = "google-fonts-studio";
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.href =
        `https://fonts.googleapis.com/css2?` +
        GOOGLE_FONTS.map(
          (f) => `family=${f.replace(/ /g, "+")}:wght@400;700`,
        ).join("&") +
        `&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  // Status message auto-clear timer
  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  useEffect(() => {
    const initialHistory = [
      {
        elements: safeClone(elementsRef.current),
        background: safeClone(backgroundRef.current),
      },
    ];
    historyRef.current = initialHistory;
    historyIndexRef.current = 0;
    setHistory(initialHistory);
    setHistoryIndex(0);
  }, []);

  // Auto-scroll color picker into view
  useEffect(() => {
    if (activeColorEditId && propsPanelRef.current) {
      setTimeout(() => {
        const picker = document.getElementById(`picker-${activeColorEditId}`);
        if (picker) {
          picker.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  }, [activeColorEditId]);

  // Persist to LocalStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const projectData = {
        elements,
        background,
        contextSignature: editorContextSignatureRef.current,
      };
      try {
        localStorage.setItem(
          projectStorageKeyRef.current,
          JSON.stringify(projectData),
        );
      } catch (e) {
        console.warn("localStorage quota exceeded, skipping autosave.", e);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [elements, background]);

  const updateSelectedElement = useCallback(
    (patchOrUpdater, options = {}) => {
      if (!selectedElement) return;

      applyElementsUpdate(
        (prev) =>
          prev.map((el) => {
            if (el.id !== selectedElement.id) return el;

            if (typeof patchOrUpdater === "function") {
              const nextValue = patchOrUpdater(el);
              if (!nextValue || typeof nextValue !== "object") return el;
              if (nextValue === el) return el;

              const looksLikeFullElement =
                Object.prototype.hasOwnProperty.call(nextValue, "id") ||
                Object.prototype.hasOwnProperty.call(nextValue, "type");
              return looksLikeFullElement ? nextValue : { ...el, ...nextValue };
            }

            return { ...el, ...patchOrUpdater };
          }),
        options,
      );
    },
    [applyElementsUpdate, selectedElement],
  );

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    const nextIndex = historyIndexRef.current - 1;
    const pastState = historyRef.current[nextIndex];
    if (!pastState) return;

    const nextElements = safeClone(pastState.elements || []);
    const nextBg = safeClone(pastState.background || backgroundRef.current);

    historyIndexRef.current = nextIndex;
    elementsRef.current = nextElements;
    backgroundRef.current = nextBg;

    setHistoryIndex(nextIndex);
    setElements(nextElements);
    setBackground(nextBg);
    setSelectedIds([]);
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const nextIndex = historyIndexRef.current + 1;
    const futureState = historyRef.current[nextIndex];
    if (!futureState) return;

    const nextElements = safeClone(futureState.elements || []);
    const nextBg = safeClone(futureState.background || backgroundRef.current);

    historyIndexRef.current = nextIndex;
    elementsRef.current = nextElements;
    backgroundRef.current = nextBg;

    setHistoryIndex(nextIndex);
    setElements(nextElements);
    setBackground(nextBg);
    setSelectedIds([]);
  };

  const applyBackgroundChange = useCallback(
    (nextBackground, options = {}) => {
      const { saveHistory = true, statusMessage = "" } = options;
      const normalized = normalizeBackgroundOption(
        nextBackground,
        0,
        ARTBOARD_W,
        ARTBOARD_H,
      );
      if (!normalized) {
        setStatusMsg("Background change failed.");
        return;
      }

      const lockedBackground = { ...normalized, locked: true };
      backgroundRef.current = lockedBackground;
      setBackground(lockedBackground);
      setSelectedIds([]);
      setActiveColorEditId(null);

      if (saveHistory) {
        saveToHistory(elementsRef.current, lockedBackground);
      }

      if (statusMessage) {
        setStatusMsg(statusMessage);
      }
    },
    [ARTBOARD_H, ARTBOARD_W, saveToHistory],
  );

  const resetBackgroundToBoot = useCallback(() => {
    const fallbackBg = bootBackgroundRef.current
      ? { ...bootBackgroundRef.current, locked: true }
      : {
          id: "bg_base",
          label: "Background",
          src: null,
          color: "#ffffff",
          width: ARTBOARD_W,
          height: ARTBOARD_H,
          locked: true,
        };

    applyBackgroundChange(fallbackBg, { statusMessage: "Background reset." });
  }, [ARTBOARD_H, ARTBOARD_W, applyBackgroundChange]);

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
      setStatusMsg("Error: Background image must be 2 MB or smaller.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result =
        typeof event?.target?.result === "string" ? event.target.result : null;
      if (!result) {
        setStatusMsg("Error: Failed to read background image.");
        return;
      }

      const img = new Image();
      img.onload = () => {
        const nextBg = {
          id: `bg_upload_${Date.now()}`,
          label:
            String(file.name || "Custom Background").replace(/\.[^.]+$/, "") ||
            "Custom Background",
          src: result,
          color: backgroundRef.current?.color || "#ffffff",
          width: ARTBOARD_W,
          height: ARTBOARD_H,
          locked: true,
          sourceType: "local-upload",
        };

        const nextOptions = mergeBackgroundOptions(
          backgroundOptionsRef.current,
          [nextBg],
        );
        backgroundOptionsRef.current = nextOptions;
        setBackgroundOptions(nextOptions);
        applyBackgroundChange(nextBg, { statusMessage: "Background updated." });
      };
      img.onerror = () =>
        setStatusMsg("Error: Uploaded background could not be loaded.");
      img.src = result;
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
      setStatusMsg("Error: Uploaded image must be 2 MB or smaller.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result =
        typeof event?.target?.result === "string" ? event.target.result : null;
      if (!result) {
        setStatusMsg("Error: Failed to read image file.");
        return;
      }

      const img = new Image();
      img.onload = () => {
        const id = `image_${Date.now()}`;
        const startWidth = Math.min(200, img.width);
        const startHeight = startWidth * (img.height / img.width);
        const newEl = {
          id,
          type: "image",
          src: result,
          x: ARTBOARD_W / 2 - startWidth / 2,
          y: ARTBOARD_H / 2 - startHeight / 2,
          width: startWidth,
          height: startHeight,
          rotation: 0,
          visible: true,
          locked: false,
          opacity: 1,
          strokes: [],
          color: "#ffffff",
          fillType: "solid",
          gradientColor2: "#ffffff",
          gradientAngle: 90,
          borderRadius: 0,
          sourceType: "local-upload",
          originalFileName: String(file.name || ""),
          originalWidth: safeNum(img.width, startWidth),
          originalHeight: safeNum(img.height, startHeight),
          preserveAspectRatio: true,
        };
        applyElementsUpdate((prev) => [...prev, newEl]);
        setSelectedIds([id]);
        setActiveTool("select");
      };
      img.onerror = () =>
        setStatusMsg("Error: Uploaded image could not be loaded.");
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addElement = (type) => {
    const id = `${type}_${Date.now()}`;
    // Bug 10 fix: line elements get a 12px-tall hitbox instead of 100px height
    const defaultH = type === "line" ? 12 : 100;
    const newEl =
      type === "text"
        ? {
            id,
            type: "text",
            content: "New Text",
            x: 100,
            y: 100,
            fontSize: 32,
            fontFamily: "Inter",
            textAlign: "left",
            warpStyle: "none",
            warpBend: 50,
            warpDistortH: 0,
            warpDistortV: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            color: "#1a1a1a",
            visible: true,
            locked: false,
            fillType: "solid",
            opacity: 1,
            strokes: [],
            letterSpacing: 0,
            lineHeight: 1.2,
            fontWeight: "bold",
            fontStyle: "normal",
            textTransform: "none",
            textDecoration: "none",
          }
        : {
            id,
            type,
            x: 150,
            y: 150,
            width: 100,
            height: defaultH,
            rotation: 0,
            color: "#3b82f6",
            visible: true,
            locked: false,
            points: type === "star" ? 5 : undefined,
            fillType: "solid",
            gradientColor2: "#ffffff",
            gradientAngle: 90,
            opacity: 1,
            strokes: [],
            borderRadius: 0,
          };
    applyElementsUpdate((prev) => [...prev, newEl]);
    setSelectedIds([id]);
    setActiveTool("select");
    setShowShapeMenu(false);
  };

  const activateEyedropper = async () => {
    const EyeDropperCtor =
      typeof window !== "undefined" ? window["EyeDropper"] : null;
    if (!EyeDropperCtor) {
      setStatusMsg("Browser does not support EyeDropper.");
      return;
    }
    const eyeDropper = new EyeDropperCtor();
    try {
      const result = await eyeDropper.open();

      if (activeColorEditId === "canvas") {
        const nextBg = { ...backgroundRef.current, color: result.sRGBHex };
        backgroundRef.current = nextBg;
        setBackground(nextBg);
        saveToHistory(elementsRef.current, nextBg);
        return;
      }

      if (selectedElement) {
        if (activeColorEditId === "fill") {
          updateSelectedElement({ color: result.sRGBHex });
        } else if (activeColorEditId === "fill2") {
          updateSelectedElement({ gradientColor2: result.sRGBHex });
        } else if (activeColorEditId?.startsWith("stroke-")) {
          const idx = parseInt(activeColorEditId.split("-")[1]);
          updateStroke(idx, "color", result.sRGBHex);
        } else {
          updateSelectedElement({ color: result.sRGBHex });
        }
      } else {
        const nextBg = { ...backgroundRef.current, color: result.sRGBHex };
        backgroundRef.current = nextBg;
        setBackground(nextBg);
        saveToHistory(elementsRef.current, nextBg);
      }
    } catch (e) {}
  };

  const applyPathfinder = (operation) => {
    if (!RELEASE_ENABLE_PATHFINDER) return;
    if (selectedIdsCount !== 2) return;

    const el1 = elements.find((el) => el.id === selectedIds[0]);
    const el2 = elements.find((el) => el.id === selectedIds[1]);
    if (!el1 || !el2 || el1.id === el2.id) {
      setStatusMsg("Pathfinder requires two valid shape elements.");
      return;
    }

    const sorted = [el1, el2].sort(
      (a, b) => elements.indexOf(a) - elements.indexOf(b),
    );
    const backEl = sorted[0];
    const frontEl = sorted[1];
    const allowedTypes = [
      "rect",
      "circle",
      "star",
      "triangle",
      "hexagon",
      "heart",
      "arrow",
    ];

    if (
      !allowedTypes.includes(backEl.type) ||
      !allowedTypes.includes(frontEl.type)
    ) {
      setStatusMsg("Pathfinder requires two shape elements.");
      return;
    }

    const b1 = getElementBounds(backEl);
    const b2 = getElementBounds(frontEl);
    const overlapMinX = Math.max(b1.minX, b2.minX);
    const overlapMaxX = Math.min(b1.maxX, b2.maxX);
    const overlapMinY = Math.max(b1.minY, b2.minY);
    const overlapMaxY = Math.min(b1.maxY, b2.maxY);
    const hasOverlap = overlapMinX < overlapMaxX && overlapMinY < overlapMaxY;

    if (operation === "intersect" && !hasOverlap) {
      setStatusMsg("Intersect requires overlapping shapes.");
      return;
    }

    let minX, maxX, minY, maxY;
    if (operation === "subtract") {
      minX = b1.minX;
      maxX = b1.maxX;
      minY = b1.minY;
      maxY = b1.maxY;
    } else if (operation === "intersect") {
      minX = overlapMinX;
      maxX = overlapMaxX;
      minY = overlapMinY;
      maxY = overlapMaxY;
    } else {
      minX = Math.min(b1.minX, b2.minX);
      maxX = Math.max(b1.maxX, b2.maxX);
      minY = Math.min(b1.minY, b2.minY);
      maxY = Math.max(b1.maxY, b2.maxY);
    }

    const width = Math.max(10, maxX - minX);
    const height = Math.max(10, maxY - minY);
    const newCompound = {
      id: `compound_${Date.now()}`,
      type: "compound",
      operation,
      sourceOperation: operation,
      color: backEl.color,
      fillType: backEl.fillType || "solid",
      gradientColor2: backEl.gradientColor2 || "#ffffff",
      gradientAngle: safeNum(backEl.gradientAngle, 90),
      x: minX,
      y: minY,
      width,
      height,
      originalWidth: width,
      originalHeight: height,
      rotation: 0,
      visible: true,
      locked: false,
      opacity: safeNum(backEl.opacity, 1),
      strokes: [],
      children: [
        {
          ...backEl,
          localX: safeNum(backEl.x, 0) - minX,
          localY: safeNum(backEl.y, 0) - minY,
        },
        {
          ...frontEl,
          localX: safeNum(frontEl.x, 0) - minX,
          localY: safeNum(frontEl.y, 0) - minY,
        },
      ],
    };

    applyElementsUpdate((prev) => {
      const selectedSet = new Set(selectedIds);
      const insertionIndex = prev.reduce((count, currentEl, index) => {
        if (index >= elements.indexOf(frontEl)) return count;
        return selectedSet.has(currentEl.id) ? count : count + 1;
      }, 0);
      const updated = prev.filter((el) => !selectedSet.has(el.id));
      updated.splice(insertionIndex, 0, newCompound);
      return updated;
    });
    setSelectedIds([newCompound.id]);
  };

  const alignElements = (direction) => {
    if (selectedIds.length < 2) return;

    applyElementsUpdate((prevElements) => {
      const selectedEls = prevElements.filter(
        (el) => selectedIds.includes(el.id) && !el.locked,
      );
      if (selectedEls.length < 2) return prevElements;

      let globalMinX = Infinity,
        globalMaxX = -Infinity;
      let globalMinY = Infinity,
        globalMaxY = -Infinity;

      selectedEls.forEach((el) => {
        const b = getElementBounds(el);
        if (b.minX < globalMinX) globalMinX = b.minX;
        if (b.maxX > globalMaxX) globalMaxX = b.maxX;
        if (b.minY < globalMinY) globalMinY = b.minY;
        if (b.maxY > globalMaxY) globalMaxY = b.maxY;
      });

      const globalCenterX = (globalMinX + globalMaxX) / 2;
      const globalCenterY = (globalMinY + globalMaxY) / 2;

      return prevElements.map((el) => {
        if (!selectedIds.includes(el.id) || el.locked) return el;

        const b = getElementBounds(el);
        const cx = (b.minX + b.maxX) / 2;
        const cy = (b.minY + b.maxY) / 2;

        let dx = 0,
          dy = 0;

        switch (direction) {
          case "left":
            dx = globalMinX - b.minX;
            break;
          case "center":
            dx = globalCenterX - cx;
            break;
          case "right":
            dx = globalMaxX - b.maxX;
            break;
          case "top":
            dy = globalMinY - b.minY;
            break;
          case "middle":
            dy = globalCenterY - cy;
            break;
          case "bottom":
            dy = globalMaxY - b.maxY;
            break;
        }

        return { ...el, x: safeNum(el.x, 0) + dx, y: safeNum(el.y, 0) + dy };
      });
    });

    setStatusMsg(`Objects aligned ${direction}`);
  };

  const getDesignSnapshot = useCallback(() => {
    try {
      return buildTudiDesignSnapshot({
        elements,
        background,
        artboardW: ARTBOARD_W,
        artboardH: ARTBOARD_H,
      });
    } catch (e) {
      console.error("Snapshot error:", e);
      return null;
    }
  }, [elements, background, ARTBOARD_W, ARTBOARD_H]);

  const handleAddToCart = useCallback(async () => {
    if (submitStatus === "submitting") return;

    const bootstrap = themeBootstrapRef.current || getThemeBootstrap();
    const sourceVariantId = resolveShopifySourceVariantId();
    const bootstrapCartVariantId = resolveShopifyCartVariantId();
    const rawCartVariantId =
      parsePositiveVariantId(resolvedCartVariantId) || bootstrapCartVariantId;
    const sourceProductHandle = String(bootstrap.productHandle || "").trim();
    const cartProductHandle = String(
      resolvedCartProductHandle ||
        bootstrap.cartProductHandle ||
        bootstrap.customOrderProductHandle ||
        bootstrap.tudiCustomOrderProductHandle ||
        DEFAULT_CUSTOM_ORDER_PRODUCT_HANDLE ||
        "",
    ).trim();
    const normalizedSourceProductHandle = slugify(sourceProductHandle);
    const normalizedCartProductHandle = slugify(cartProductHandle);
    const sourceUsesCustomProduct = !!(
      normalizedSourceProductHandle &&
      normalizedCartProductHandle &&
      normalizedSourceProductHandle === normalizedCartProductHandle
    );
    const cartVariantId =
      rawCartVariantId || (sourceUsesCustomProduct ? sourceVariantId : null);
    const forceDirectCart = !!bootstrap.forceDirectCart;

    window.__TUDIWRAP_LAST_CART_DEBUG__ = {
      sourceVariantId,
      bootstrapCartVariantId,
      resolvedCartVariantId: parsePositiveVariantId(resolvedCartVariantId),
      rawCartVariantId,
      cartVariantId,
      cartProductHandle,
      productHandle: bootstrap.productHandle || "",
      sourceUsesCustomProduct,
      backgroundId: background?.id || null,
      backgroundLabel: background?.label || null,
    };

    if (!cartVariantId) {
      setStatusMsg(
        "Error: Custom order variant is not configured. Please send cartVariantId from theme/bootstrap.",
      );
      setSubmitStatus("error");
      return;
    }

    if (
      !sourceUsesCustomProduct &&
      sourceVariantId &&
      Number(cartVariantId) === Number(sourceVariantId)
    ) {
      setStatusMsg(
        "Error: Custom order variant is not configured. Please send cartVariantId from theme/bootstrap.",
      );
      setSubmitStatus("error");
      return;
    }

    const validation = validateDesignDocumentForAddToCart({
      elements,
      background,
      variantId: cartVariantId,
    });

    if (!validation.ok) {
      setStatusMsg(`Error: ${validation.errors[0]}`);
      setSubmitStatus("error");
      return;
    }

    const snapshot = getDesignSnapshot();
    if (!snapshot) {
      setStatusMsg("Error: Failed to generate design snapshot.");
      setSubmitStatus("error");
      return;
    }

    const previewDataUrl = await buildCartPreviewDataUrl();
    const { payload, properties, summaryText, pricingMode } =
      buildShopifyCartPayload({
        cartVariantId,
        sourceVariantId,
        sourceProductHandle: sourceProductHandle || "",
        cartProductHandle,
        snapshot,
        previewDataUrl,
        pricingModeOverride: sourceUsesCustomProduct
          ? "custom-design-product"
          : null,
      });

    window.__TUDIWRAP_LAST_CART_DEBUG__ = {
      ...(window.__TUDIWRAP_LAST_CART_DEBUG__ || {}),
      sourceVariantId,
      resolvedCartVariantId: parsePositiveVariantId(resolvedCartVariantId),
      cartVariantId,
      cartProductHandle,
      sourceProductHandle: bootstrap.productHandle || "",
      pricingMode,
      payload,
    };

    setSubmitStatus("submitting");
    setStatusMsg(
      pricingMode === "custom-design-product"
        ? "Adding custom design product to cart..."
        : "Adding to cart...",
    );

    const finalizeCartSuccess = (message) => {
      setStatusMsg(message);
      setSubmitStatus("success");
      setTimeout(() => {
        clearDraft();
        setSubmitStatus("idle");
      }, 1000);
    };

    const shouldBypassThemeIntercept =
      forceDirectCart || pricingMode === "custom-design-product";

    if (!shouldBypassThemeIntercept) {
      const eventDetail = {
        variantId: cartVariantId,
        cartVariantId,
        sourceVariantId,
        sourceProductHandle: bootstrap.productHandle || "",
        cartProductHandle,
        pricingMode,
        properties,
        payload,
        snapshot,
        summary: summaryText,
        themeResultPromise: null,
        themeCompletion: null,
        waitUntil(promise) {
          this.themeResultPromise = Promise.resolve(promise).then((result) => {
            this.themeCompletion = normalizeThemeCartResult(result);
            return result;
          });
        },
        complete(result) {
          this.themeCompletion = normalizeThemeCartResult(result);
        },
      };

      const event = new CustomEvent("tudiwrap:cart-payload-ready", {
        detail: eventDetail,
        cancelable: true,
      });
      const notCanceled = document.dispatchEvent(event);

      if (!notCanceled) {
        if (eventDetail.themeResultPromise) {
          try {
            await eventDetail.themeResultPromise;
            const themeResult = normalizeThemeCartResult(
              eventDetail.themeCompletion,
            );
            if (!themeResult.success) {
              setStatusMsg(`Error: ${themeResult.message}`);
              setSubmitStatus("error");
              return;
            }
            finalizeCartSuccess(
              themeResult.message ||
                (pricingMode === "custom-design-product"
                  ? "Custom design added to cart successfully!"
                  : "Added to cart successfully!"),
            );
          } catch (themeError) {
            const themeMessage =
              themeError instanceof Error
                ? themeError.message
                : "Theme Add to Cart handler failed.";
            setStatusMsg(`Error: ${themeMessage}`);
            setSubmitStatus("error");
          }
          return;
        }

        if (eventDetail.themeCompletion) {
          const themeResult = normalizeThemeCartResult(
            eventDetail.themeCompletion,
          );
          if (!themeResult.success) {
            setStatusMsg(`Error: ${themeResult.message}`);
            setSubmitStatus("error");
            return;
          }
          finalizeCartSuccess(
            themeResult.message ||
              (pricingMode === "custom-design-product"
                ? "Custom design added to cart successfully!"
                : "Added to cart successfully!"),
          );
          return;
        }

        setStatusMsg(
          "Error: Theme intercepted Add to Cart but did not confirm success.",
        );
        setSubmitStatus("error");
        return;
      }
    }

    try {
      const resp = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        finalizeCartSuccess(
          pricingMode === "custom-design-product"
            ? "Custom design added to cart successfully!"
            : "Added to cart successfully!",
        );
      } else {
        let errorMessage = "Failed to add to cart via API.";
        try {
          const errorJson = await resp.json();
          errorMessage =
            errorJson?.description || errorJson?.message || errorMessage;
        } catch (error) {}
        setStatusMsg(`Error: ${errorMessage}`);
        setSubmitStatus("error");
      }
    } catch (e) {
      setStatusMsg(`Error: ${e.message}`);
      setSubmitStatus("error");
    }
  }, [elements, background, getDesignSnapshot, submitStatus]);

  const applyProductBackgroundOption = useCallback(
    (option) => {
      if (!option) return;

      const nextBg = {
        id: option.id,
        label: option.label,
        src: option.src,
        color: option.color || "#ffffff",
        width: ARTBOARD_W,
        height: ARTBOARD_H,
        locked: true,
      };

      const nextOptions = mergeBackgroundOptions(backgroundOptionsRef.current, [
        nextBg,
      ]);
      backgroundOptionsRef.current = nextOptions;
      setBackgroundOptions(nextOptions);
      applyBackgroundChange(nextBg, {
        statusMessage: "Product background updated.",
      });
      setShowProductBackgroundBrowser(false);
      setShowBackgroundMenu(false);
    },
    [ARTBOARD_H, ARTBOARD_W, applyBackgroundChange],
  );

  const buildCartPreviewDataUrl = useCallback(async () => {
    if (!fabricCanvasRef.current) return null;
    try {
      // Create a cloned version to not affect the live canvas state for scaling
      // Or simply use toDataURL with multiplier to achieve 408x131 from 815x261 (approx 0.5x)
      const multiplier = 408 / ARTBOARD_W;

      // Temporarily deselect all for preview
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();

      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: "jpeg",
        quality: 0.72,
        multiplier: multiplier,
      });

      if (!dataUrl || dataUrl.length > CART_PREVIEW_MAX_DATA_URL_LENGTH)
        return null;
      return dataUrl;
    } catch (error) {
      console.warn("Failed to build cart preview data URL.", error);
      return null;
    }
  }, [ARTBOARD_W]);

  const exportCanvasToImage = async () => {
    if (!fabricCanvasRef.current) {
      setStatusMsg("Error: Editor canvas not ready.");
      return;
    }
    try {
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        multiplier: 1,
      });

      const link = document.createElement("a");
      const label = slugify(background?.label || "Untitled");
      link.download = `tudiwrap-${label}.png`;
      link.href = dataURL;
      link.click();
      setStatusMsg("PNG exported successfully!");
    } catch (error) {
      console.warn("Canvas export failed while serializing PNG.", error);
      setStatusMsg("PNG export failed.");
    }
  };

  const addStroke = () => {
    updateSelectedElement((prev) => {
      if (prev.strokes && prev.strokes.length >= 3) return prev;
      const newStroke = {
        color: "#000000",
        width: 5,
        alignment: "outside",
        join: "round",
      };
      return { strokes: [newStroke, ...(prev.strokes || [])] };
    });
  };

  const removeStroke = (index) => {
    updateSelectedElement((prev) => ({
      strokes: (prev.strokes || []).filter((_, i) => i !== index),
    }));
  };

  const updateStroke = (index, key, val) => {
    updateSelectedElement((prev) => {
      const newStrokes = [...(prev.strokes || [])];
      newStrokes[index] = { ...newStrokes[index], [key]: val };
      return { strokes: newStrokes };
    });
  };

  const moveLayerLocal = (id, direction) => {
    applyElementsUpdate((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index < 0) return prev;
      const newElements = [...prev];
      if (direction === "up" && index < prev.length - 1) {
        [newElements[index], newElements[index + 1]] = [
          newElements[index + 1],
          newElements[index],
        ];
      } else if (direction === "down" && index > 0) {
        [newElements[index], newElements[index - 1]] = [
          newElements[index - 1],
          newElements[index],
        ];
      } else return prev;
      return newElements;
    });
  };

  const didMove = useRef(false); // Bug 8 fix: track real movement to avoid saving on click-only

  const handleUp = () => {
    if (panStart.current) {
      panStart.current = null;
    }
    if (isDragging) {
      setIsDragging(false);
      setMarquee(null);
      // Bug 8 fix: only save to history if the user actually moved/resized something
      if (didMove.current) {
        saveToHistory(elementsRef.current, backgroundRef.current);
      }
      didMove.current = false;
      dragInfo.current.type = null;
    }
  };

  const clearDraft = () => {
    const defaultBg = bootBackgroundRef.current
      ? { ...bootBackgroundRef.current, locked: true }
      : {
          id: "bg_base",
          label: "Background",
          src: null,
          color: "#ffffff",
          width: ARTBOARD_W,
          height: ARTBOARD_H,
          locked: true,
        };

    elementsRef.current = [];
    backgroundRef.current = defaultBg;

    setElements([]);
    setBackground(defaultBg);
    setSelectedIds([]);
    setActiveColorEditId(null);
    setMarquee(null);
    setIsDragging(false);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          projectStorageKeyRef.current,
          JSON.stringify({
            elements: [],
            background: defaultBg,
            contextSignature: editorContextSignatureRef.current,
          }),
        );
      } catch (e) {
        console.warn("Failed to persist cleared draft state.", e);
      }
    }

    saveToHistory([], defaultBg);
  };

  // Bug 1 fix: use refs so the registered listener always calls latest handleMove/handleUp
  const handleMoveRef = useRef(null);
  const handleUpRef = useRef(null);

  const handleMove = (e) => {
    // Pan the viewport when Space is held
    if (panStart.current || dragInfo.current?.type === "pan") {
      const startP = panStart.current || { x: e.clientX, y: e.clientY };
      const dx = e.clientX - startP.x;
      const dy = e.clientY - startP.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      panStart.current = { x: e.clientX, y: e.clientY };
      return;
    }
    if (!isDragging || dragInfo.current.type === null) return;
    const { ids, type, startX, startY, initialVals } = dragInfo.current;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;
    if (type === "marquee") {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const curX = (e.clientX - canvasRect.left) / zoom;
      const curY = (e.clientY - canvasRect.top) / zoom;
      const sX = (startX - canvasRect.left) / zoom;
      const sY = (startY - canvasRect.top) / zoom;
      const mX = Math.min(sX, curX);
      const mY = Math.min(sY, curY);
      const mW = Math.abs(curX - sX);
      const mH = Math.abs(curY - sY);
      setMarquee({ x: mX, y: mY, w: mW, h: mH });
      const newlySelected = elements
        .filter((el) => {
          const b = getElementBounds(el);
          return !(
            b.minX > mX + mW ||
            b.maxX < mX ||
            b.minY > mY + mH ||
            b.maxY < mY
          );
        })
        .map((el) => el.id);
      setSelectedIds(newlySelected);
      return;
    }
    didMove.current = true; // Bug 8: mark that a real move occurred
    setElements((prev) => {
      const nextElements = prev.map((el) => {
        if (!ids.includes(el.id) || el.locked) return el;
        const initialVal = initialVals[el.id];
        if (type === "drag")
          return {
            ...el,
            x: safeNum(initialVal.x + dx, el.x),
            y: safeNum(initialVal.y + dy, el.y),
          };
        if (type.startsWith("resize-")) {
          const dir = type.split("-")[1];
          const bounds = getVisualBounds(initialVal);
          const initW = Math.max(1, bounds.w);
          const initH = Math.max(1, bounds.h);
          const initX = safeNum(initialVal.x, 0);
          const initY = safeNum(initialVal.y, 0);
          const rad = safeNum(initialVal.rotation, 0) * (Math.PI / 180);
          const rDx = dx * Math.cos(-rad) - dy * Math.sin(-rad);
          const rDy = dx * Math.sin(-rad) + dy * Math.cos(-rad);
          let dw = 0,
            dh = 0;
          if (dir.includes("e")) dw = rDx;
          if (dir.includes("w")) dw = -rDx;
          if (dir.includes("s")) dh = rDy;
          if (dir.includes("n")) dh = -rDy;
          if ((e.shiftKey || mobileShift) && dir.length === 2) {
            const ratio = initH / initW;
            if (Math.abs(dw) > Math.abs(dh))
              dh = Math.abs(dw * ratio) * Math.sign(dh || 1);
            else dw = Math.abs(dh / ratio) * Math.sign(dw || 1);
          }
          let newW = Math.max(10, initW + dw);
          let newH = Math.max(10, initH + dh);
          const actualDw = newW - initW;
          const actualDh = newH - initH;
          let fX = 0,
            fY = 0;
          if (dir.includes("e")) fX = 1;
          if (dir.includes("w")) fX = -1;
          if (dir.includes("s")) fY = 1;
          if (dir.includes("n")) fY = -1;
          const localCx = (actualDw / 2) * fX;
          const localCy = (actualDh / 2) * fY;
          const dCx = localCx * Math.cos(rad) - localCy * Math.sin(rad);
          const dCy = localCx * Math.sin(rad) + localCy * Math.cos(rad);
          const newX = safeNum(initX + dCx - actualDw / 2, el.x);
          const newY = safeNum(initY + dCy - actualDh / 2, el.y);
          if (el.type === "text") {
            const intrinsic = getIntrinsicBounds(initialVal);
            return {
              ...el,
              x: newX,
              y: newY,
              scaleX: safeNum(newW / Math.max(1, intrinsic.w), 1),
              scaleY: safeNum(newH / Math.max(1, intrinsic.h), 1),
            };
          }
          if (
            Array.isArray(initialVal.customPoints) &&
            initialVal.customPoints.length > 1
          ) {
            const pointBounds = getCustomPointBounds(
              initialVal.customPoints,
              initW,
              initH,
            );
            const scaleX = Math.max(
              0.01,
              newW / Math.max(1, pointBounds.width),
            );
            const scaleY = Math.max(
              0.01,
              newH / Math.max(1, pointBounds.height),
            );
            const scaledPoints = pointBounds.points.map((point) => ({
              x: (point.x - pointBounds.minX) * scaleX,
              y: (point.y - pointBounds.minY) * scaleY,
            }));
            return normalizeCustomPointElement(
              { ...el, x: newX, y: newY, width: newW, height: newH },
              scaledPoints,
            );
          }
          return {
            ...el,
            x: newX,
            y: newY,
            width: safeNum(newW, el.width),
            height: safeNum(newH, el.height),
          };
        }
        if (type === "rotate") {
          const rotateDx = e.clientX - safeNum(initialVal.centerX, e.clientX);
          const rotateDy = e.clientY - safeNum(initialVal.centerY, e.clientY);
          let angle = Math.atan2(rotateDy, rotateDx) * (180 / Math.PI);
          let newRotation = safeNum(angle, 0);
          if (Math.abs(newRotation % 45) < 5 || Math.abs(newRotation % 45) > 40)
            newRotation = Math.round(newRotation / 45) * 45;
          return { ...el, rotation: Math.round((newRotation + 360) % 360) };
        }
        if (type === "radius") {
          const cornerIdx = dragInfo.current.index;
          if (!initialVal) return el;
          const bounds = getVisualBounds(initialVal);
          const maxRadius = Math.min(bounds.w, bounds.h) / 2;
          let newR = safeNum(initialVal.borderRadius || 0, 0);

          // Bug Fix: Arah Tarikan Live Corners Terbalik Saat Dirotasi
          // Transformasikan dx, dy layar ke dx, dy lokal kotak
          const rad = -safeNum(initialVal.rotation, 0) * (Math.PI / 180);
          const localDx = dx * Math.cos(rad) - dy * Math.sin(rad);
          const localDy = dx * Math.sin(rad) + dy * Math.cos(rad);

          if (cornerIdx === 0)
            newR += (localDx + localDy) / 2; // Top-Left: geser ke kanan/bawah = tambah radius
          else if (cornerIdx === 1)
            newR += (-localDx + localDy) / 2; // Top-Right: geser ke kiri/bawah = tambah radius
          else if (cornerIdx === 2)
            newR += (-localDx - localDy) / 2; // Bottom-Right: geser ke kiri/atas = tambah radius
          else if (cornerIdx === 3) newR += (localDx - localDy) / 2; // Bottom-Left: geser ke kanan/atas = tambah radius

          return {
            ...el,
            borderRadius: Math.max(0, Math.min(maxRadius, newR)),
          };
        }
        if (type === "anchor") {
          const idx = dragInfo.current.index;
          if (!initialVal) return el;
          const bounds = getVisualBounds(initialVal);
          const pts = Array.isArray(initialVal.customPoints)
            ? initialVal.customPoints
                .filter((point) => point && typeof point === "object")
                .map((point) => ({ ...point }))
            : getDefaultPoints(initialVal, bounds);
          const basePoint = pts[idx];
          if (!basePoint) return el;
          const rad = -safeNum(initialVal.rotation, 0) * (Math.PI / 180);
          const localDx = dx * Math.cos(rad) - dy * Math.sin(rad);
          const localDy = dx * Math.sin(rad) + dy * Math.cos(rad);
          pts[idx] = { x: basePoint.x + localDx, y: basePoint.y + localDy };

          // Bug Fix: Jangan gunakan state saat ini ({ ...el }) karena akan terjadi feedback loop (jumping).
          // Selalu gunakan koordinat statis dari awal drag (initialVal) karena dx, dy adalah kumulatif dari mouse start.
          return normalizeCustomPointElement(
            {
              ...el,
              x: initialVal.x,
              y: initialVal.y,
              width: initialVal.width,
              height: initialVal.height,
            },
            pts,
          );
        }
        return el;
      });

      elementsRef.current = nextElements;
      return nextElements;
    });
  };

  // Keep refs updated to latest function instances
  handleMoveRef.current = handleMove;
  handleUpRef.current = handleUp;

  // Mouse wheel zoom on viewport
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) => Math.min(4, Math.max(0.1, z - e.deltaY * 0.001)));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Shortcut keys
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT")
        return;
      if (e.code === "Space") {
        e.preventDefault();
        spaceDown.current = true;
      }
      if (e.key.toLowerCase() === "v") {
        setActiveTool("select");
      }
      if (e.key.toLowerCase() === "a") {
        setActiveTool("direct-select");
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          applyElementsUpdate((prev) =>
            prev.filter((el) => !selectedIds.includes(el.id)),
          );
          setSelectedIds([]);
        }
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "Space") {
        spaceDown.current = false;
        panStart.current = null;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [selectedIds, applyElementsUpdate]);

  // Bug 1 fix: use stable ref-dispatching wrappers so closures never go stale
  useEffect(() => {
    const moveWrapper = (e) =>
      handleMoveRef.current && handleMoveRef.current(e);
    const upWrapper = (e) => handleUpRef.current && handleUpRef.current(e);
    if (isDragging) {
      window.addEventListener("pointermove", moveWrapper, { passive: false });
      window.addEventListener("pointerup", upWrapper);
      window.addEventListener("pointercancel", upWrapper);
      return () => {
        window.removeEventListener("pointermove", moveWrapper);
        window.removeEventListener("pointerup", upWrapper);
        window.removeEventListener("pointercancel", upWrapper);
      };
    }
  }, [isDragging]);

  // --- COMPONENT RENDER ---

  return (
    <div className="relative h-screen w-full bg-[#0a0f1d] text-slate-200 overflow-hidden font-sans select-none touch-none">
      {/* Status Notification Toast */}
      {statusMsg && (
        <div className="fixed top-24 md:top-4 left-1/2 -translate-x-1/2 z-[1000] bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={18} />
          <span className="text-xs font-bold tracking-wide">{statusMsg}</span>
        </div>
      )}

      {/* Utility Panel Atas (Undo, Redo, Zoom, Delete, Clear) */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-[#1e293b]/90 backdrop-blur-xl border border-slate-700/50 shadow-lg flex flex-row items-center z-40 transition-all duration-500 h-10 w-max rounded-full px-2 gap-1.5 md:gap-2">
        <button
          onClick={undo}
          disabled={historyIndex === 0}
          title="Undo"
          className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-full disabled:opacity-20 text-indigo-400 transition-all"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex === history.length - 1}
          title="Redo"
          className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-full disabled:opacity-20 text-indigo-400 transition-all"
        >
          <Redo2 size={16} />
        </button>

        <div className="h-5 w-[1.5px] bg-slate-700/50 mx-0.5" />

        <button
          onClick={() => setZoom((z) => Math.min(4, z + 0.1))}
          title="Zoom In"
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all"
        >
          <ZoomIn size={16} />
        </button>
        <span className="text-[10px] font-mono text-slate-300 font-bold w-9 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
          title="Zoom Out"
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all"
        >
          <ZoomOut size={16} />
        </button>

        <div className="h-5 w-[1.5px] bg-slate-700/50 mx-0.5" />

        <button
          onClick={() => {
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            if (selectedIds.length === 0) return;
            applyElementsUpdate((prev) =>
              prev.filter((el) => !selectedIds.includes(el.id)),
            );
            setSelectedIds([]);
            setIsBottomPanelOpen(false);
            setStatusMsg("Selected object deleted.");
          }}
          disabled={selectedIds.length === 0}
          title="Delete Selected Object"
          aria-label="Delete Selected Object"
          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-600/80 rounded-full transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-red-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          <Trash2 size={16} />
        </button>

        <button
          onClick={() => {
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            if (clearArmed) {
              clearDraft();
              setClearArmed(false);
              setStatusMsg("Canvas Cleared!");
            } else {
              setClearArmed(true);
              setTimeout(() => setClearArmed(false), 5000);
            }
          }}
          title={clearArmed ? "Click again to confirm" : "Clear Project"}
          aria-label={clearArmed ? "Confirm Clear Project" : "Clear Project"}
          className={`w-8 h-8 flex items-center justify-center transition-all duration-300 rounded-full border focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${clearArmed ? "bg-red-600 border-red-400 text-white animate-pulse" : "text-slate-400 hover:text-white hover:bg-slate-700 border-transparent"}`}
        >
          {clearArmed ? (
            <AlertTriangle size={16} />
          ) : (
            <span className="text-[10px] font-black uppercase tracking-wider px-1">
              Clear
            </span>
          )}
        </button>
      </div>

      <div className="absolute inset-0 z-0">
        {/* Top Bar (Header) - Mobile Friendly */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1e293b]/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl flex items-center z-40 transition-all duration-500 overflow-visible h-14 w-[95%] max-w-[760px] rounded-2xl px-3 md:px-5 justify-between gap-2 md:gap-3">
          <div className="flex items-center justify-between w-full h-full gap-2">
            <div className="flex items-center gap-2 shrink min-w-0">
              <button
                type="button"
                onClick={handleBackNavigation}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0"
                title="Back"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <div className="hidden md:flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <h1 className="text-[13px] font-black text-white uppercase tracking-[0.16em] leading-none drop-shadow-sm truncate">
                  TUDI WRAP CUSTOM DESIGN
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {customCartVariantConfigured ? (
                <div
                  className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[9px] font-black uppercase tracking-[0.18em]"
                  title="Add to Cart will use your custom-priced Shopify product variant"
                >
                  <Check size={12} /> Custom Price
                </div>
              ) : null}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowBackgroundMenu((prev) => !prev);
                    setShowShapeMenu(false);
                  }}
                  className={`bg-slate-800 hover:bg-slate-700 px-2 py-1.5 md:px-3 md:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 md:gap-2 transition-all ${showBackgroundMenu ? "text-white ring-1 ring-indigo-500" : "text-slate-300"}`}
                  title="Change Background"
                >
                  <ImageIcon size={14} />
                  <span>BG</span>
                </button>

                {showBackgroundMenu && (
                  <div className="absolute top-[calc(100%+10px)] right-0 w-[300px] max-w-[82vw] bg-[#1e293b]/95 backdrop-blur-2xl border border-slate-700/60 rounded-2xl p-3 shadow-2xl z-[120]">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          Change Background
                        </div>
                        <div className="text-[11px] font-bold text-white truncate">
                          {background?.label || "Current background"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowBackgroundMenu(false)}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Close"
                      >
                        <Plus size={14} className="mx-auto rotate-45" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={openProductBackgroundBrowser}
                        className={`w-full px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-colors ${showProductBackgroundBrowser ? "border-indigo-500 text-white bg-indigo-500/10" : "border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white bg-slate-800"}`}
                      >
                        Use Our Template
                      </button>
                    </div>

                    {showProductBackgroundBrowser && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3 mb-3 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                              {activeTemplateView === "products"
                                ? "Select Template"
                                : "Use Our Template"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {activeTemplateView === "products"
                                ? "Select a design template from this collection"
                                : "Choose a collection to view templates"}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (activeTemplateView === "products") {
                                setProductBackgroundError("");
                                setActiveTemplateView("collections");
                              } else {
                                loadShopifyCollectionsList();
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-slate-700"
                          >
                            {activeTemplateView === "products"
                              ? "Back"
                              : "Refresh"}
                          </button>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                          {isLoadingProductBackgroundOptions ? (
                            <div className="text-[10px] text-slate-400 py-4 text-center">
                              Loading templates...
                            </div>
                          ) : productBackgroundError ? (
                            <div className="py-6 flex flex-col items-center justify-center gap-3">
                              <div className="text-[10px] text-red-400 text-center px-4">
                                {productBackgroundError}
                              </div>
                              {activeTemplateView === "products" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductBackgroundError("");
                                    setActiveTemplateView("collections");
                                  }}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-colors border border-slate-700 mt-2"
                                >
                                  Back to Collections
                                </button>
                              )}
                            </div>
                          ) : activeTemplateView === "collections" ? (
                            <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
                              {shopCollections.length === 0 ? (
                                <div className="text-[10px] text-slate-500 py-4 text-center">
                                  No collections found.
                                </div>
                              ) : (
                                shopCollections.map((collection) => (
                                  <button
                                    key={collection.handle}
                                    type="button"
                                    onClick={() =>
                                      fetchProductsByCollection(
                                        collection.handle,
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-800 bg-slate-800/50 hover:bg-slate-700 p-3 text-left transition-all flex items-center justify-between group"
                                  >
                                    <span className="text-[10px] font-bold text-slate-200 truncate">
                                      {collection.title}
                                    </span>
                                    <ArrowRight
                                      size={12}
                                      className="text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0"
                                    />
                                  </button>
                                ))
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
                              {collectionProducts.length === 0 ? (
                                <div className="text-[10px] text-slate-500 py-4 text-center">
                                  No templates found in this collection.
                                </div>
                              ) : (
                                collectionProducts.map((option) => {
                                  const isActive =
                                    String(option.id) ===
                                    String(background?.id);
                                  return (
                                    <button
                                      key={option.id}
                                      type="button"
                                      onClick={() =>
                                        applyProductBackgroundOption(option)
                                      }
                                      className={`w-full rounded-xl border p-2 text-left transition-all flex gap-3 items-center ${isActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800"}`}
                                    >
                                      <div
                                        className="h-10 w-10 shrink-0 rounded-lg border border-slate-800 bg-center bg-cover bg-no-repeat"
                                        style={{
                                          backgroundColor:
                                            option.color || "#ffffff",
                                          backgroundImage: option.src
                                            ? `url(${option.src})`
                                            : "none",
                                        }}
                                      />
                                      <span className="text-[10px] font-bold text-slate-200 truncate flex-1">
                                        {option.label}
                                      </span>
                                      {isActive && (
                                        <Check
                                          size={12}
                                          className="text-indigo-400 shrink-0"
                                        />
                                      )}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!showProductBackgroundBrowser && (
                      <button
                        type="button"
                        onClick={() => {
                          resetBackgroundToBoot();
                          setShowBackgroundMenu(false);
                        }}
                        className="w-full mb-3 px-3 py-2 rounded-xl border border-slate-700 text-slate-300 text-[9px] font-black uppercase tracking-widest hover:border-indigo-500 hover:text-white transition-colors"
                      >
                        Use Current Product BG
                      </button>
                    )}

                    <p className="text-[8px] text-slate-500 leading-4">
                      Pilih template TUDIwrap dari daftar koleksi toko Anda.
                      Background Anda saat ini akan ditimpa dengan gambar
                      template yang dipilih.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShowBackgroundMenu(false);
                  exportCanvasToImage();
                }}
                title="Export"
                aria-label="Export"
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => {
                  setShowBackgroundMenu(false);
                  handleAddToCart();
                }}
                disabled={submitStatus === "submitting"}
                className={`${submitStatus === "success" ? "bg-green-600 hover:bg-green-500" : submitStatus === "error" ? "bg-red-600 hover:bg-red-500" : "bg-indigo-600 hover:bg-indigo-500"} text-white px-2 py-1.5 md:px-3 md:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 md:gap-2 transition-all shadow-xl shadow-indigo-600/10 disabled:opacity-75 shrink-0 whitespace-nowrap`}
              >
                <ShoppingCart
                  size={14}
                  className={
                    submitStatus === "submitting"
                      ? "animate-pulse opacity-50"
                      : ""
                  }
                />
                <span>
                  {submitStatus === "submitting"
                    ? "..."
                    : submitStatus === "success"
                      ? "Added!"
                      : submitStatus === "error"
                        ? "Failed"
                        : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="absolute inset-0 overflow-hidden bg-[#0a0f1d] flex items-start justify-center pt-36 pb-20 md:pt-24 md:pb-32 px-4 md:px-20 z-0 scrollbar-hide"
          style={{
            cursor: spaceDown.current ? "grab" : "default",
            touchAction: "none",
          }}
          onPointerDownCapture={(e) => {
            gestureRef.current.pointers.set(e.pointerId, {
              x: e.clientX,
              y: e.clientY,
            });
            // Global tap-to-close logic for when users click the empty grey space
            if (e.target === viewportRef.current) {
              if (!spaceDown.current) {
                setSelectedIds([]);
                setShowBackgroundMenu(false);
                setShowShapeMenu(false);
                setActiveColorEditId(null);
                setIsBottomPanelOpen(false);
                setActivePropertyTab(null);
              }
            }
            if (gestureRef.current.pointers.size >= 2) {
              setIsDragging(false);
              dragInfo.current.type = null;
              const pts = [...gestureRef.current.pointers.values()];
              const [p1, p2] = pts;
              gestureRef.current.lastDist = Math.hypot(
                p2.x - p1.x,
                p2.y - p1.y,
              );
              gestureRef.current.lastMid = {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
              };
            }
          }}
          onPointerDown={(e) => {
            if (spaceDown.current) {
              panStart.current = { x: e.clientX, y: e.clientY };
              setIsDragging(true);
              dragInfo.current = {
                ids: [],
                type: "pan",
                startX: e.clientX,
                startY: e.clientY,
                initialVals: {},
              };
            }
          }}
          onPointerMoveCapture={(e) => {
            if (!gestureRef.current.pointers.has(e.pointerId)) return;
            gestureRef.current.pointers.set(e.pointerId, {
              x: e.clientX,
              y: e.clientY,
            });
            if (
              gestureRef.current.pointers.size >= 2 &&
              gestureRef.current.lastDist !== null
            ) {
              e.preventDefault();
              e.stopPropagation();
              const pts = [...gestureRef.current.pointers.values()];
              const [p1, p2] = pts;
              const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
              const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

              if (gestureRef.current.lastDist > 0) {
                const scale = dist / gestureRef.current.lastDist;
                setZoom((z) => Math.min(4, Math.max(0.1, z * scale)));
              }
              const dx = (mid.x - gestureRef.current.lastMid.x) * 1.5;
              const dy = (mid.y - gestureRef.current.lastMid.y) * 1.5;
              setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));

              gestureRef.current.lastDist = dist;
              gestureRef.current.lastMid = mid;
            }
          }}
          onPointerUpCapture={(e) => {
            gestureRef.current.pointers.delete(e.pointerId);
            if (gestureRef.current.pointers.size < 2) {
              gestureRef.current.lastDist = null;
              gestureRef.current.lastMid = null;
            }
          }}
          onPointerCancelCapture={(e) => {
            gestureRef.current.pointers.delete(e.pointerId);
            if (gestureRef.current.pointers.size < 2) {
              gestureRef.current.lastDist = null;
              gestureRef.current.lastMid = null;
            }
          }}
        >
          <div
            className="flex flex-col items-center gap-10"
            style={{
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
              transformOrigin: "top center",
              flexShrink: 0,
              touchAction: "none",
              marginBottom: "120px",
            }}
          >
            <div
              id="main-canvas-container"
              onPointerDown={(e) => {
                if ((e.target.id === "main-canvas-container" || e.target.classList.contains("upper-canvas")) && !spaceDown.current && selectedIds.length === 0) {
                  setSelectedIds([]);
                  setShowBackgroundMenu(false);
                  setShowShapeMenu(false);
                  setActiveColorEditId(null);
                  setIsBottomPanelOpen(false);
                  setActivePropertyTab(null);
                }
              }}
              style={{
                width: ARTBOARD_W,
                height: ARTBOARD_H,
                backgroundColor: "transparent",
                position: "relative",
                overflow: "visible", // Changed from hidden so fabric corners don't clip
                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
              }}
            >
              <canvas ref={canvasRef} id="fabric-canvas" />

              {/* DOM Rendering temporarily disabled to favor Fabric.js */}
              {/* DOM Rendering has been removed to favor Fabric.js */}

              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-[999]">
                <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-indigo-500" />{" "}
                <div className="absolute left-1/2 top-0 h-full w-[0.5px] bg-indigo-500" />
                <div
                  style={{
                    width: GUIDE1_W,
                    height: GUIDE1_H,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    border: "1.5px dashed #6366f1",
                  }}
                />
                <div
                  style={{
                    width: GUIDE2_W,
                    height: GUIDE2_H,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    border: "1.5px dashed #ef4444",
                  }}
                />
              </div>
            </div>

            {/* Instruction Panel */}
            <div
              className="w-full max-w-[815px] bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 text-slate-300 shadow-2xl pointer-events-auto flex flex-col gap-6"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <span className="text-indigo-400">✨</span> How to Design
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      1. Choose Background
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Click the <strong>BG</strong> button at the top to select
                      from our product templates or upload your own image.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Waves size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      2. Text Warp & Distort
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Add text and use our powerful <strong>Warp tools</strong>!
                      Bend, arc, bulge, or squeeze your text to fit the wrapper
                      perfectly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <PenTool size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      3. Triple Custom Strokes
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Make your design pop! You can add up to{" "}
                      <strong>3 layers of strokes (borders)</strong> to any text
                      or shape with custom colors and widths.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      4. Preview & Checkout
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use the layer panel to adjust order, double check your
                      design, and click <strong>Add to Cart</strong> when you're
                      ready to order!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contextual Properties Toolbar (Muncul saat objek dipilih) */}
      <div
        role="toolbar"
        aria-label="Properties Toolbar"
        className={`fixed left-0 w-full md:left-1/2 md:-translate-x-1/2 md:w-auto bg-[#1e293b]/95 backdrop-blur-xl border-y md:border border-slate-700/80 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-[50] transition-all duration-300 md:rounded-3xl px-2 py-2 flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide
          ${selectedIdsCount > 0 && !activePropertyTab && !isBottomPanelOpen ? "bottom-20 md:bottom-32 opacity-100 translate-y-0" : "bottom-0 opacity-0 translate-y-10 pointer-events-none"}`}
      >
        {selectedIdsCount > 1 && (
          <>
            {/* Multi-Select Options */}
            <button
              onClick={() => {
                setActivePropertyTab("multi-actions");
              }}
              className={`flex flex-col items-center justify-center min-w-[70px] h-12 rounded-xl transition-all ${activePropertyTab === "multi-actions" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
            >
              <Layers size={16} className="text-indigo-400 mb-1" />
              <span className="text-[8px] font-black uppercase text-indigo-300">
                Actions
              </span>
            </button>
          </>
        )}

        {selectedElement && (
          <>
            {/* Common Appearance */}
            <button
              onClick={() => {
                setActivePropertyTab("appearance");
                setPickerTab("swatches");
              }}
              className={`flex flex-col items-center justify-center min-w-[60px] h-12 rounded-xl transition-all ${activePropertyTab === "appearance" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
            >
              <div
                className="w-4 h-4 rounded-full border border-white/50 mb-1"
                style={{ backgroundColor: selectedElement.color }}
              />
              <span className="text-[8px] font-black uppercase">Color</span>
            </button>

            {/* Text Specific */}
            {selectedElement.type === "text" && (
              <>
                <button
                  onClick={() => setActivePropertyTab("typography")}
                  className={`flex flex-col items-center justify-center min-w-[60px] h-12 rounded-xl transition-all ${activePropertyTab === "typography" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <Type size={16} />
                  <span className="text-[8px] font-black uppercase mt-1">
                    Font
                  </span>
                </button>
                <button
                  onClick={() => setActivePropertyTab("warp")}
                  className={`flex flex-col items-center justify-center min-w-[60px] h-12 rounded-xl transition-all ${activePropertyTab === "warp" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <Waves size={16} />
                  <span className="text-[8px] font-black uppercase mt-1">
                    Warp
                  </span>
                </button>
              </>
            )}

            {/* Strokes & Borders */}
            {selectedElement.type !== "image" && (
              <button
                onClick={() => setActivePropertyTab("stroke")}
                className={`flex flex-col items-center justify-center min-w-[60px] h-12 rounded-xl transition-all ${activePropertyTab === "stroke" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <PenTool size={16} />
                <span className="text-[8px] font-black uppercase mt-1">
                  Stroke
                </span>
              </button>
            )}

            {/* Opacity */}
            <button
              onClick={() => setActivePropertyTab("opacity")}
              className={`flex flex-col items-center justify-center min-w-[60px] h-12 rounded-xl transition-all ${activePropertyTab === "opacity" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
            >
              <Sun size={16} />
              <span className="text-[8px] font-black uppercase mt-1">
                Opacity
              </span>
            </button>

            {/* Transform / Position */}

            {/* Transform */}
            <button
              onClick={() => setActivePropertyTab("transform")}
              className={`flex flex-col items-center justify-center min-w-[60px] h-12 rounded-xl transition-all ${activePropertyTab === "transform" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
            >
              <Maximize size={16} />
              <span className="text-[8px] font-black uppercase mt-1">Size</span>
            </button>
          </>
        )}
      </div>

      {/* Main Tools Group (Bottom Navigation - Fat-finger friendly) */}
      <div
        role="toolbar"
        aria-label="Drawing Tools"
        className="fixed bottom-0 left-0 w-full bg-[#1e293b]/95 backdrop-blur-xl border-t border-slate-700/80 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-evenly z-[60] pb-safe pt-2 px-2 h-20 md:h-20 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-auto md:rounded-3xl md:border md:px-6 md:gap-4 md:shadow-2xl transition-transform duration-500"
        style={{
          transform:
            isBottomPanelOpen || activePropertyTab
              ? "translateY(150%) md:translateY(0)"
              : "translateY(0)",
        }}
      >
        <button
          onClick={() => {
            setActiveTool("select");
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            setActivePropertyTab(null);
            setIsBottomPanelOpen(false);
            setSelectedIds([]);
          }}
          title="Select"
          aria-label="Selection Tool"
          className={`flex flex-col items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${activeTool === "select" ? "text-indigo-400" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
        >
          <MousePointer2
            size={22}
            className={activeTool === "select" ? "fill-indigo-400/20" : ""}
          />
          <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
            Select
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTool("direct-select");
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            setActivePropertyTab(null);
          }}
          title="Direct Select"
          aria-label="Direct Selection Tool"
          className={`flex flex-col items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${activeTool === "direct-select" ? "text-indigo-400" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
        >
          <MousePointerClick
            size={22}
            className={
              activeTool === "direct-select" ? "fill-indigo-400/20" : ""
            }
          />
          <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
            Direct
          </span>
        </button>

        <div className="w-[1px] h-8 bg-slate-700/50 mx-1 hidden md:block shrink-0" />

        <div className="relative flex flex-col items-center justify-center">
          <button
            onClick={() => {
              setShowShapeMenu(!showShapeMenu);
              setShowBackgroundMenu(false);
            }}
            title="Shapes"
            aria-label="Shapes Menu"
            aria-expanded={showShapeMenu}
            aria-haspopup="true"
            className={`flex flex-col items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${showShapeMenu ? "text-indigo-400" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
          >
            <Plus size={22} />
            <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
              Shape
            </span>
          </button>
          {showShapeMenu && (
            <div
              role="menu"
              className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-[#1e293b]/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2.5 shadow-2xl z-[100] flex gap-2 animate-in slide-in-from-bottom-2"
            >
              {SHAPE_TOOL_ITEMS.filter(({ type }) =>
                RELEASE_VISIBLE_SHAPES.includes(type),
              ).map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  role="menuitem"
                  aria-label={`Add ${label}`}
                  onClick={() => {
                    setCurrentShape(type);
                    addElement(type);
                    setShowShapeMenu(false);
                    setShowBackgroundMenu(false);
                  }}
                  title={label}
                  className={`p-3 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${currentShape === type ? "bg-indigo-500 text-white" : "hover:bg-slate-700 text-slate-400"}`}
                >
                  <Icon size={24} />
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          aria-label="Add Text"
          onClick={() => {
            addElement("text");
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            setActivePropertyTab(null);
            setIsBottomPanelOpen(false);
          }}
          title="Text (T)"
          className="flex flex-col items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          <Type size={22} />
          <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
            Text
          </span>
        </button>

        <button
          aria-label="Eyedropper Tool"
          onClick={() => {
            activateEyedropper();
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            setActivePropertyTab(null);
            setIsBottomPanelOpen(false);
          }}
          title="Eyedropper (I)"
          className={`flex flex-col items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${activeTool === "eyedropper" ? "text-indigo-400" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
        >
          <Pipette size={22} />
          <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
            Color
          </span>
        </button>

        <button
          aria-label="Upload Image"
          onClick={() => {
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            setActivePropertyTab(null);
            fileInputRef.current?.click();
          }}
          title="Image"
          className="flex flex-col items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          <ImageIcon size={22} />
          <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
            Image
          </span>
        </button>

        <button
          aria-label="Layers"
          onClick={() => {
            setShowShapeMenu(false);
            setShowBackgroundMenu(false);
            setSelectedIds([]);
            setActivePropertyTab(null);
            setActiveTab("layers");
            setIsBottomPanelOpen(true);
          }}
          title="Layers"
          className={`flex flex-col items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${activeTab === "layers" && isBottomPanelOpen ? "text-indigo-400" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
        >
          <Layers
            size={22}
            className={
              activeTab === "layers" && isBottomPanelOpen
                ? "text-indigo-400"
                : ""
            }
          />
          <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
            Layers
          </span>
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={backgroundFileInputRef}
        onChange={handleBackgroundImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Mobile Settings Toggle Button (Hanya jika tidak ada yang dipilih) */}
      <button
        onClick={() => {
          setIsBottomPanelOpen((prev) => !prev);
          setActivePropertyTab(null);
        }}
        className={`fixed bottom-[96px] right-4 md:hidden w-12 h-12 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center z-40 transition-transform duration-300 ${!activePropertyTab && !selectedElement ? "scale-100" : "scale-0"} focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none`}
        aria-label="Open Settings"
      >
        <Settings2 size={24} />
      </button>

      {/* Bottom Sheet (Properties Contextual View) */}
      <div
        className={`fixed z-[70] transition-all duration-500 flex flex-col items-center
          ${
            isBottomPanelOpen || activePropertyTab
              ? "bottom-0 left-0 w-full h-auto max-h-[48vh] md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[900px] md:max-h-[340px] opacity-100 translate-y-0"
              : "bottom-0 left-0 w-full h-auto max-h-[48vh] md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[900px] md:max-h-[340px] opacity-0 translate-y-full pointer-events-none"
          }`}
      >
        <div
          className={`bg-[#1e293b]/90 backdrop-blur-2xl border-t border-slate-700/50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col w-full h-full transition-all duration-500 rounded-t-2xl md:rounded-2xl`}
        >
          {/* Handle / Drag Area for Mobile */}
          <div
            className="w-full flex justify-center pt-3 pb-1 md:hidden"
            onClick={() => {
              setIsBottomPanelOpen(false);
              setActivePropertyTab(null);
            }}
          >
            <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
          </div>

          <div className="w-full flex justify-between items-center px-6 py-4 border-b border-slate-700/50 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {activePropertyTab === "appearance"
                ? "Color & Appearance"
                : activePropertyTab === "typography"
                  ? "Text Font & Format"
                  : activePropertyTab === "warp"
                    ? "Distort & Warp"
                    : activePropertyTab === "stroke"
                      ? "Stroke / Border"
                      : activePropertyTab === "opacity"
                        ? "Opacity & Transparency"
                        : activePropertyTab === "transform"
                          ? "Size & Transformation"
                          : activeTab === "layers"
                            ? "Layers & Order"
                            : "Canvas Settings"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBottomPanelOpen(false);
                setActivePropertyTab(null);
              }}
              aria-label="Close panel"
              className="text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <Plus size={24} className="rotate-45" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar flex flex-col items-center">
            <div className="w-full max-w-[400px] pb-8">
              {/* --- MULTI-ACTIONS --- */}
              {selectedIdsCount > 1 &&
                activePropertyTab === "multi-actions" && (
                  <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2 px-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 tracking-widest text-center">
                        Align Objects
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => alignElements("left")}
                          className="py-3 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Left
                        </button>
                        <button
                          onClick={() => alignElements("center")}
                          className="py-3 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Center
                        </button>
                        <button
                          onClick={() => alignElements("right")}
                          className="py-3 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Right
                        </button>
                        <button
                          onClick={() => alignElements("top")}
                          className="py-3 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Top
                        </button>
                        <button
                          onClick={() => alignElements("middle")}
                          className="py-3 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Middle
                        </button>
                        <button
                          onClick={() => alignElements("bottom")}
                          className="py-3 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Bottom
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              {/* --- CANVAS / DEFAULT SETTINGS --- */}
              {!selectedElement &&
                (!activePropertyTab || activePropertyTab === "canvas") &&
                activeTab !== "layers" &&
                selectedIdsCount <= 1 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        Background Color
                      </span>
                      <button
                        onClick={() => {
                          setPickerTab("swatches");
                          setActiveColorEditId(
                            activeColorEditId === "canvas" ? null : "canvas",
                          );
                        }}
                        className="w-full h-8 rounded-lg border border-slate-700 shadow-inner flex items-center px-4 gap-3 hover:border-indigo-500 transition-all"
                        style={{ backgroundColor: background.color }}
                      >
                        <span
                          className={`text-[10px] font-mono font-bold ${parseInt((background.color || "#ffffff").replace("#", ""), 16) > 0x888888 ? "text-black" : "text-white"}`}
                        >
                          {(background.color || "#ffffff").toUpperCase()}
                        </span>
                      </button>
                      <ColorEditorArea
                        editId="canvas"
                        activeColor={background.color}
                        onColorChange={(c) => {
                          const nextBg = { ...backgroundRef.current, color: c };
                          backgroundRef.current = nextBg;
                          setBackground(nextBg);
                          saveToHistory(elementsRef.current, nextBg);
                        }}
                        activeColorEditId={activeColorEditId}
                        pickerTab={pickerTab}
                        setPickerTab={setPickerTab}
                        activateEyedropper={activateEyedropper}
                      />
                    </div>
                  </div>
                )}

              {/* --- LAYERS VIEW --- */}
              {!selectedElement &&
                activeTab === "layers" &&
                !activePropertyTab && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    {[...elements].reverse().map((el) => (
                      <div
                        key={el.id}
                        onClick={(e) => {
                          if (e.shiftKey || mobileShift) {
                            setSelectedIds((prev) =>
                              prev.includes(el.id)
                                ? prev.filter((x) => x !== el.id)
                                : [...prev, el.id],
                            );
                          } else setSelectedIds([el.id]);
                        }}
                        className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all ${selectedIds.includes(el.id) ? "bg-indigo-500/10 border-indigo-500/50" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          {el.type === "text" ? (
                            <Type size={14} />
                          ) : el.type === "rect" ? (
                            <Square size={14} />
                          ) : el.type === "circle" ? (
                            <Circle size={14} />
                          ) : el.type === "star" ? (
                            <Star size={14} />
                          ) : el.type === "triangle" ? (
                            <TriangleIcon size={14} />
                          ) : el.type === "image" ? (
                            <ImageIcon size={14} />
                          ) : (
                            <Box size={14} />
                          )}
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 truncate flex-1">
                          {el.type === "text"
                            ? el.content
                            : el.type.toUpperCase()}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayerLocal(el.id, "up");
                            }}
                            className="p-1.5 bg-slate-800 rounded hover:text-indigo-400 hover:bg-slate-700 transition-colors"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayerLocal(el.id, "down");
                            }}
                            className="p-1.5 bg-slate-800 rounded hover:text-indigo-400 hover:bg-slate-700 transition-colors"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* --- APPEARANCE & COLOR --- */}
              {selectedElement && activePropertyTab === "appearance" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex bg-slate-900/50 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() =>
                        updateSelectedElement({ fillType: "solid" })
                      }
                      className={`flex-1 py-1 text-[10px] font-bold rounded-md uppercase transition-all ${selectedElement.fillType === "solid" || !selectedElement.fillType ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500"}`}
                    >
                      Solid
                    </button>
                    <button
                      onClick={() =>
                        updateSelectedElement({ fillType: "gradient" })
                      }
                      className={`flex-1 py-1 text-[10px] font-bold rounded-md uppercase transition-all ${selectedElement.fillType === "gradient" ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500"}`}
                    >
                      Gradient
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      {selectedElement.fillType === "gradient"
                        ? "Color 1"
                        : "Fill Color"}
                    </span>
                    <button
                      onClick={() => {
                        setPickerTab("swatches");
                        setActiveColorEditId(
                          activeColorEditId === "fill" ? null : "fill",
                        );
                      }}
                      className="w-full h-8 rounded-lg border border-slate-700 shadow-inner flex items-center px-4 gap-3 hover:border-indigo-500 transition-all"
                      style={{ backgroundColor: selectedElement.color }}
                    >
                      <span
                        className={`text-[10px] font-mono font-bold ${parseInt(selectedElement.color.replace("#", ""), 16) > 0x888888 ? "text-black" : "text-white"}`}
                      >
                        {selectedElement.color.toUpperCase()}
                      </span>
                    </button>
                    <ColorEditorArea
                      editId="fill"
                      activeColor={selectedElement.color}
                      onColorChange={(c) => updateSelectedElement({ color: c })}
                      activeColorEditId={activeColorEditId}
                      pickerTab={pickerTab}
                      setPickerTab={setPickerTab}
                      activateEyedropper={activateEyedropper}
                    />
                  </div>

                  {selectedElement.fillType === "gradient" && (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/50">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">
                        Color 2
                      </span>
                      <button
                        onClick={() => {
                          setPickerTab("swatches");
                          setActiveColorEditId(
                            activeColorEditId === "fill2" ? null : "fill2",
                          );
                        }}
                        className="w-full h-8 rounded-lg border border-slate-700 shadow-inner flex items-center px-4 gap-3 hover:border-indigo-500 transition-all"
                        style={{
                          backgroundColor:
                            selectedElement.gradientColor2 || "#ffffff",
                        }}
                      >
                        <span
                          className={`text-[10px] font-mono font-bold ${parseInt((selectedElement.gradientColor2 || "#ffffff").replace("#", ""), 16) > 0x888888 ? "text-black" : "text-white"}`}
                        >
                          {(
                            selectedElement.gradientColor2 || "#ffffff"
                          ).toUpperCase()}
                        </span>
                      </button>
                      <ColorEditorArea
                        editId="fill2"
                        activeColor={
                          selectedElement.gradientColor2 || "#ffffff"
                        }
                        onColorChange={(c) =>
                          updateSelectedElement({ gradientColor2: c })
                        }
                        activeColorEditId={activeColorEditId}
                        pickerTab={pickerTab}
                        setPickerTab={setPickerTab}
                        activateEyedropper={activateEyedropper}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* --- TYPOGRAPHY --- */}
              {selectedElement &&
                activePropertyTab === "typography" &&
                selectedElement.type === "text" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                        <span>Font Family</span>
                      </div>
                      <select
                        value={selectedElement.fontFamily || "Inter"}
                        onChange={(e) =>
                          updateSelectedElement({ fontFamily: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white outline-none focus:border-indigo-500"
                      >
                        {GOOGLE_FONTS.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                          <span>Spacing</span>{" "}
                          <span className="text-indigo-400 font-mono">
                            {selectedElement.letterSpacing}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="50"
                          value={selectedElement.letterSpacing || 0}
                          onChange={(e) =>
                            updateSelectedElement({
                              letterSpacing: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full accent-indigo-500 h-1 cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                          <span>Leading</span>{" "}
                          <span className="text-indigo-400 font-mono">
                            {selectedElement.lineHeight}x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={selectedElement.lineHeight || 1.2}
                          onChange={(e) =>
                            updateSelectedElement({
                              lineHeight: parseFloat(e.target.value),
                            })
                          }
                          className="w-full accent-indigo-500 h-1 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800/50">
                      <button
                        onClick={() =>
                          updateSelectedElement((el) => ({
                            ...el,
                            fontWeight:
                              el.fontWeight === "bold" ? "normal" : "bold",
                          }))
                        }
                        className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${selectedElement.fontWeight === "bold" ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        B
                      </button>
                      <button
                        onClick={() =>
                          updateSelectedElement((el) => ({
                            ...el,
                            fontStyle:
                              el.fontStyle === "italic" ? "normal" : "italic",
                          }))
                        }
                        className={`flex-1 py-1 rounded-md text-xs font-bold italic transition-all ${selectedElement.fontStyle === "italic" ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        I
                      </button>
                      <button
                        onClick={() =>
                          updateSelectedElement((el) => ({
                            ...el,
                            textDecoration:
                              el.textDecoration === "underline"
                                ? "none"
                                : "underline",
                          }))
                        }
                        className={`flex-1 py-1 rounded-md text-xs font-bold underline transition-all ${selectedElement.textDecoration === "underline" ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        U
                      </button>
                      <button
                        onClick={() =>
                          updateSelectedElement((el) => ({
                            ...el,
                            textTransform:
                              el.textTransform === "uppercase"
                                ? "none"
                                : "uppercase",
                          }))
                        }
                        className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${selectedElement.textTransform === "uppercase" ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        TT
                      </button>
                    </div>

                    <div className="pt-1">
                      <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase mb-1">
                        <span>Text Content</span>
                      </div>
                      <textarea
                        value={selectedElement.content}
                        onChange={(e) =>
                          updateSelectedElement({ content: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-bold min-h-[60px] text-white outline-none focus:border-indigo-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

              {/* --- WARP --- */}
              {selectedElement &&
                activePropertyTab === "warp" &&
                selectedElement.type === "text" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                        <span>Warp Style</span>
                      </div>
                      <select
                        value={selectedElement.warpStyle || "none"}
                        onChange={(e) =>
                          updateSelectedElement({ warpStyle: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white outline-none focus:border-indigo-500"
                      >
                        <optgroup label="Standard">
                          <option value="none">None</option>
                          <option value="arc">Arc</option>
                          <option value="arcLower">Arc Lower</option>
                          <option value="arcUpper">Arc Upper</option>
                          <option value="arch">Arch</option>
                        </optgroup>
                        <optgroup label="Distortions">
                          <option value="bulge">Bulge</option>
                          <option value="shellLower">Shell Lower</option>
                          <option value="shellUpper">Shell Upper</option>
                          <option value="flag">Flag</option>
                          <option value="wave">Wave</option>
                          <option value="fish">Fish</option>
                          <option value="rise">Rise</option>
                        </optgroup>
                        <optgroup label="Advanced">
                          <option value="fishEye">FishEye</option>
                          <option value="inflate">Inflate</option>
                          <option value="squeeze">Squeeze</option>
                          <option value="twist">Twist</option>
                          <option value="perspective">Perspective</option>
                        </optgroup>
                      </select>
                    </div>

                    {selectedElement.warpStyle !== "none" && (
                      <div className="flex flex-col gap-3 pt-2 animate-in fade-in slide-in-from-top-2 border-t border-slate-800/50">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase italic">
                            <span>Bend Intensity</span>{" "}
                            <span className="text-indigo-400 font-mono">
                              {selectedElement.warpBend}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={safeNum(selectedElement.warpBend, 0)}
                            onChange={(e) =>
                              updateSelectedElement({
                                warpBend: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-full accent-indigo-500 h-1.5 cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase italic">
                            <span>Horizontal Distort</span>{" "}
                            <span className="text-indigo-400 font-mono">
                              {selectedElement.warpDistortH || 0}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={selectedElement.warpDistortH || 0}
                            onChange={(e) =>
                              updateSelectedElement({
                                warpDistortH: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-full accent-indigo-500 h-1.5 cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase italic">
                            <span>Vertical Distort</span>{" "}
                            <span className="text-indigo-400 font-mono">
                              {selectedElement.warpDistortV || 0}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={selectedElement.warpDistortV || 0}
                            onChange={(e) =>
                              updateSelectedElement({
                                warpDistortV: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-full accent-indigo-500 h-1.5 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* --- STROKE --- */}
              {selectedElement && activePropertyTab === "stroke" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Current Strokes
                    </span>
                    <button
                      onClick={addStroke}
                      className="text-indigo-400 hover:text-indigo-300 disabled:opacity-30 p-1 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-full transition-all"
                      disabled={selectedElement.strokes?.length >= 3}
                    >
                      <PlusCircle size={14} />
                    </button>
                  </div>
                  {(selectedElement.strokes || []).map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/40 p-2 rounded-xl border border-slate-700/50 space-y-2 relative group transition-all"
                    >
                      <button
                        onClick={() => removeStroke(idx)}
                        className="absolute -top-2 -right-2 text-red-500 bg-slate-900 rounded-full p-0.5 opacity-100 border border-red-500/20 shadow-lg"
                      >
                        {" "}
                        <MinusCircle size={12} />{" "}
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setPickerTab("swatches");
                            setActiveColorEditId(
                              activeColorEditId === `stroke-${idx}`
                                ? null
                                : `stroke-${idx}`,
                            );
                          }}
                          className="w-8 h-8 rounded-lg border border-slate-600 shadow-sm transition-transform active:scale-95 shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase mb-1.5">
                            {" "}
                            <span>Width</span>{" "}
                            <span className="text-indigo-400 font-mono">
                              {s.width}px
                            </span>{" "}
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            value={s.width}
                            onChange={(e) =>
                              updateStroke(
                                idx,
                                "width",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full accent-indigo-500 h-1.5 cursor-pointer"
                          />
                        </div>
                      </div>
                      <ColorEditorArea
                        editId={`stroke-${idx}`}
                        activeColor={s.color}
                        onColorChange={(c) => updateStroke(idx, "color", c)}
                        activeColorEditId={activeColorEditId}
                        pickerTab={pickerTab}
                        setPickerTab={setPickerTab}
                        activateEyedropper={activateEyedropper}
                      />
                      <div className="flex bg-slate-900/50 rounded-lg p-1 gap-1">
                        {["inside", "center", "outside"].map((align) => (
                          <button
                            key={align}
                            onClick={() =>
                              updateStroke(idx, "alignment", align)
                            }
                            className={`flex-1 py-1.5 text-[8px] font-bold uppercase rounded-md transition-all ${s.alignment === align ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                          >
                            {" "}
                            {align}{" "}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- OPACITY --- */}
              {selectedElement && activePropertyTab === "opacity" && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <Sun size={16} /> Opacity
                    </span>
                    <span className="text-lg font-mono text-indigo-400 font-black">
                      {Math.round(
                        Math.max(
                          0,
                          Math.min(1, safeNum(selectedElement.opacity, 1)),
                        ) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={Math.max(
                      0,
                      Math.min(1, safeNum(selectedElement.opacity, 1)),
                    )}
                    onChange={(e) =>
                      updateSelectedElement({
                        opacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-500 h-2 cursor-pointer"
                  />
                </div>
              )}

              {/* --- TRANSFORM --- */}
              {selectedElement && activePropertyTab === "transform" && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">
                        X Position
                      </span>
                      <div className="text-sm font-mono font-bold text-white">
                        {Math.round(selectedElement.x)}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">
                        Y Position
                      </span>
                      <div className="text-sm font-mono font-bold text-white">
                        {Math.round(selectedElement.y)}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">
                        Rotation
                      </span>
                      <div className="text-sm font-mono font-bold text-indigo-400">
                        {Math.round(selectedElement.rotation || 0)}°
                      </div>
                    </div>
                  </div>

                  {selectedElement.type === "star" && (
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 mt-3">
                      <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                        <span>Star Points</span>
                        <span className="text-indigo-400 font-mono">
                          {selectedElement.points || 5}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="20"
                        value={selectedElement.points || 5}
                        onChange={(e) =>
                          updateSelectedElement({
                            points: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full accent-indigo-500 h-1.5 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* --- POSITION/LAYERS FOR ELEMENT --- */}
              {selectedElement && activePropertyTab === "layers" && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">
                      Order
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => moveLayerLocal(selectedElement.id, "up")}
                        className="p-2.5 bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-indigo-400 flex items-center gap-2"
                      >
                        <ArrowUp size={16} />{" "}
                        <span className="text-[10px] font-bold uppercase">
                          Up
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          moveLayerLocal(selectedElement.id, "down")
                        }
                        className="p-2.5 bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-indigo-400 flex items-center gap-2"
                      >
                        <ArrowDown size={16} />{" "}
                        <span className="text-[10px] font-bold uppercase">
                          Down
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}
