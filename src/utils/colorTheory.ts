import chroma from 'chroma-js';

export type HarmonyType = 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic';

export interface PaletteColor {
  id: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  locked: boolean;
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'support';
}

/**
 * Generate a monochromatic palette - variations of a single hue
 */
export function generateMonochromatic(baseColor: string): string[] {
  const base = chroma(baseColor);
  const hsl = base.hsl();
  const h = hsl[0] || 0;

  return [
    base.hex(),
    chroma.hsl(h, hsl[1], Math.min(hsl[2] + 0.2, 0.9)).hex(),
    chroma.hsl(h, Math.max(hsl[1] - 0.2, 0.3), hsl[2]).hex(),
    chroma.hsl(h, hsl[1], Math.max(hsl[2] - 0.2, 0.2)).hex(),
    chroma.hsl(h, Math.max(hsl[1] - 0.1, 0.2), Math.min(hsl[2] + 0.3, 0.95)).hex(),
  ];
}

/**
 * Generate an analogous palette - adjacent colors on the wheel
 */
export function generateAnalogous(baseColor: string): string[] {
  const base = chroma(baseColor);
  const hsl = base.hsl();
  const h = hsl[0] || 0;

  return [
    base.hex(),
    chroma.hsl((h + 30) % 360, hsl[1], hsl[2]).hex(),
    chroma.hsl((h - 30 + 360) % 360, hsl[1], hsl[2]).hex(),
    chroma.hsl((h + 15) % 360, Math.max(hsl[1] - 0.2, 0.3), Math.min(hsl[2] + 0.2, 0.9)).hex(),
    chroma.hsl((h - 15 + 360) % 360, Math.max(hsl[1] - 0.3, 0.2), Math.min(hsl[2] + 0.3, 0.95)).hex(),
  ];
}

/**
 * Generate a complementary palette - opposite colors
 */
export function generateComplementary(baseColor: string): string[] {
  const base = chroma(baseColor);
  const complement = base.set('hsl.h', `+180`);

  return [
    base.hex(),
    complement.hex(),
    base.brighten(0.5).hex(),
    complement.darken(0.5).hex(),
    chroma.mix(base, complement, 0.5, 'lch').hex(),
  ];
}

/**
 * Generate a triadic palette - three colors evenly spaced (120° apart)
 */
export function generateTriadic(baseColor: string): string[] {
  const base = chroma(baseColor);
  const hsl = base.hsl();
  const h = hsl[0] || 0;

  return [
    base.hex(),
    chroma.hsl((h + 120) % 360, hsl[1], hsl[2]).hex(),
    chroma.hsl((h + 240) % 360, hsl[1], hsl[2]).hex(),
    chroma.hsl(h, Math.max(hsl[1] - 0.3, 0.2), Math.min(hsl[2] + 0.3, 0.95)).hex(),
    chroma.hsl((h + 120) % 360, Math.max(hsl[1] - 0.2, 0.3), Math.min(hsl[2] + 0.2, 0.9)).hex(),
  ];
}

/**
 * Generate a tetradic palette - two complementary pairs
 */
export function generateTetradic(baseColor: string): string[] {
  const base = chroma(baseColor);
  const hsl = base.hsl();
  const h = hsl[0] || 0;

  return [
    base.hex(),
    chroma.hsl((h + 90) % 360, hsl[1], hsl[2]).hex(),
    chroma.hsl((h + 180) % 360, hsl[1], hsl[2]).hex(),
    chroma.hsl((h + 270) % 360, hsl[1], hsl[2]).hex(),
    chroma.hsl(h, Math.max(hsl[1] - 0.3, 0.2), Math.min(hsl[2] + 0.3, 0.95)).hex(),
  ];
}

/**
 * Generate palette based on harmony type
 */
export function generatePalette(baseColor: string, harmonyType: HarmonyType): string[] {
  switch (harmonyType) {
    case 'monochromatic':
      return generateMonochromatic(baseColor);
    case 'analogous':
      return generateAnalogous(baseColor);
    case 'complementary':
      return generateComplementary(baseColor);
    case 'triadic':
      return generateTriadic(baseColor);
    case 'tetradic':
      return generateTetradic(baseColor);
    default:
      return generateMonochromatic(baseColor);
  }
}

/**
 * Convert hex color to PaletteColor object
 */
export function hexToPaletteColor(hex: string, id: string, role: PaletteColor['role'], locked = false): PaletteColor {
  const color = chroma(hex);
  const rgb = color.rgb();
  const hsl = color.hsl();

  return {
    id,
    hex: color.hex(),
    rgb: { r: Math.round(rgb[0]), g: Math.round(rgb[1]), b: Math.round(rgb[2]) },
    hsl: {
      h: Math.round(isNaN(hsl[0]) ? 0 : hsl[0]),
      s: Math.round(hsl[1] * 100),
      l: Math.round(hsl[2] * 100)
    },
    locked,
    role,
  };
}

/**
 * Generate random base color
 */
export function generateRandomColor(): string {
  return chroma.random().hex();
}

/**
 * Adjust color HSL values
 */
export function adjustColor(color: string, adjustments: { h?: number; s?: number; l?: number }): string {
  const c = chroma(color);
  const hsl = c.hsl();

  const newH = adjustments.h !== undefined ? adjustments.h : (hsl[0] || 0);
  const newS = adjustments.s !== undefined ? adjustments.s / 100 : hsl[1];
  const newL = adjustments.l !== undefined ? adjustments.l / 100 : hsl[2];

  return chroma.hsl(newH, newS, newL).hex();
}

/**
 * Calculate WCAG contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  return chroma.contrast(color1, color2);
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAG(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}
