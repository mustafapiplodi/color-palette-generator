import chroma from 'chroma-js';
import colorNamer from 'color-namer';

/**
 * Get human-readable color name
 */
export function getColorName(hex: string): string {
  try {
    const names = colorNamer(hex);
    return names.ntc[0]?.name || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

/**
 * Determine if color is warm or cool
 */
export function getColorTemperature(hex: string): 'warm' | 'cool' | 'neutral' {
  try {
    const color = chroma(hex);
    const hsl = color.hsl();
    const hue = hsl[0];

    if (isNaN(hue)) return 'neutral';

    // Warm: 0-60° (red, orange, yellow) and 300-360° (red-violet)
    if ((hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360)) {
      return 'warm';
    }
    // Cool: 180-300° (cyan, blue, violet)
    else if (hue >= 180 && hue <= 300) {
      return 'cool';
    }
    // Neutral: 60-180° (yellow-green, green, blue-green)
    else {
      return 'neutral';
    }
  } catch {
    return 'neutral';
  }
}

/**
 * Calculate color brightness (0-100)
 */
export function getColorBrightness(hex: string): number {
  try {
    const color = chroma(hex);
    const rgb = color.rgb();
    // Perceived brightness formula
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return Math.round((brightness / 255) * 100);
  } catch {
    return 50;
  }
}

/**
 * Check if color is light or dark
 */
export function isLightColor(hex: string): boolean {
  return getColorBrightness(hex) > 50;
}

/**
 * Get optimal text color (black or white) for background
 */
export function getOptimalTextColor(hex: string): string {
  return isLightColor(hex) ? '#000000' : '#FFFFFF';
}

/**
 * Parse color from various formats (HEX, RGB, HSL)
 */
export function parseColorInput(input: string): string | null {
  try {
    // Try to parse with chroma
    const color = chroma(input.trim());
    return color.hex();
  } catch {
    // Try common formats
    const hexMatch = input.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    if (hexMatch) {
      return '#' + hexMatch[1];
    }

    const rgbMatch = input.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      try {
        return chroma.rgb(
          parseInt(rgbMatch[1]),
          parseInt(rgbMatch[2]),
          parseInt(rgbMatch[3])
        ).hex();
      } catch {
        return null;
      }
    }

    const hslMatch = input.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i);
    if (hslMatch) {
      try {
        return chroma.hsl(
          parseInt(hslMatch[1]),
          parseInt(hslMatch[2]) / 100,
          parseInt(hslMatch[3]) / 100
        ).hex();
      } catch {
        return null;
      }
    }

    return null;
  }
}

/**
 * Lighten color by percentage
 */
export function lightenColor(hex: string, amount: number): string {
  try {
    return chroma(hex).brighten(amount / 50).hex();
  } catch {
    return hex;
  }
}

/**
 * Darken color by percentage
 */
export function darkenColor(hex: string, amount: number): string {
  try {
    return chroma(hex).darken(amount / 50).hex();
  } catch {
    return hex;
  }
}

/**
 * Increase saturation by percentage
 */
export function saturateColor(hex: string, amount: number): string {
  try {
    const color = chroma(hex);
    const hsl = color.hsl();
    const newS = Math.min(1, hsl[1] + amount / 100);
    return chroma.hsl(hsl[0], newS, hsl[2]).hex();
  } catch {
    return hex;
  }
}

/**
 * Decrease saturation by percentage
 */
export function desaturateColor(hex: string, amount: number): string {
  try {
    const color = chroma(hex);
    const hsl = color.hsl();
    const newS = Math.max(0, hsl[1] - amount / 100);
    return chroma.hsl(hsl[0], newS, hsl[2]).hex();
  } catch {
    return hex;
  }
}

/**
 * Shift hue by degrees
 */
export function shiftHue(hex: string, degrees: number): string {
  try {
    const color = chroma(hex);
    const hsl = color.hsl();
    const newH = (hsl[0] + degrees + 360) % 360;
    return chroma.hsl(newH, hsl[1], hsl[2]).hex();
  } catch {
    return hex;
  }
}

/**
 * Invert color
 */
export function invertColor(hex: string): string {
  try {
    const color = chroma(hex);
    const rgb = color.rgb();
    return chroma.rgb(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]).hex();
  } catch {
    return hex;
  }
}

/**
 * Mix two colors
 */
export function mixColors(hex1: string, hex2: string, ratio: number = 0.5): string {
  try {
    return chroma.mix(hex1, hex2, ratio, 'lch').hex();
  } catch {
    return hex1;
  }
}

/**
 * Generate color scale (like Tailwind 50-900)
 */
export function generateColorScale(hex: string, steps: number = 10): string[] {
  try {
    const color = chroma(hex);
    const hsl = color.hsl();

    const scale: string[] = [];
    for (let i = 0; i < steps; i++) {
      const lightness = 0.95 - (i * 0.85) / (steps - 1);
      scale.push(chroma.hsl(hsl[0], hsl[1], lightness).hex());
    }

    return scale;
  } catch {
    return [hex];
  }
}

/**
 * Encode palette to URL parameter
 */
export function encodePaletteToURL(colors: string[]): string {
  return colors.map(c => c.replace('#', '')).join('-');
}

/**
 * Decode palette from URL parameter
 */
export function decodePaletteFromURL(encoded: string): string[] {
  return encoded.split('-').map(c => '#' + c);
}
