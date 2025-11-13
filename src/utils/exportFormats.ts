import { PaletteColor } from './colorTheory';

export type ExportFormat = 'hex' | 'rgb' | 'hsl' | 'css' | 'scss' | 'json';

/**
 * Export palette as HEX list
 */
export function exportAsHex(palette: PaletteColor[]): string {
  return palette.map(color => color.hex.toUpperCase()).join('\n');
}

/**
 * Export palette as RGB list
 */
export function exportAsRgb(palette: PaletteColor[]): string {
  return palette
    .map(color => `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)
    .join('\n');
}

/**
 * Export palette as HSL list
 */
export function exportAsHsl(palette: PaletteColor[]): string {
  return palette
    .map(color => `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)
    .join('\n');
}

/**
 * Export palette as CSS custom properties
 */
export function exportAsCss(palette: PaletteColor[]): string {
  const props = palette
    .map((color) => `  --color-${color.role}: ${color.hex};`)
    .join('\n');

  return `:root {\n${props}\n}`;
}

/**
 * Export palette as SCSS variables
 */
export function exportAsScss(palette: PaletteColor[]): string {
  const vars = palette
    .map(color => `$color-${color.role}: ${color.hex};`)
    .join('\n');

  const map = `\n\n$colors: (\n${palette
    .map(color => `  '${color.role}': ${color.hex},`)
    .join('\n')}\n);`;

  return vars + map;
}

/**
 * Export palette as JSON
 */
export function exportAsJson(palette: PaletteColor[]): string {
  const data = palette.map(color => ({
    role: color.role,
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
  }));

  return JSON.stringify(data, null, 2);
}

/**
 * Export palette based on format
 */
export function exportPalette(palette: PaletteColor[], format: ExportFormat): string {
  switch (format) {
    case 'hex':
      return exportAsHex(palette);
    case 'rgb':
      return exportAsRgb(palette);
    case 'hsl':
      return exportAsHsl(palette);
    case 'css':
      return exportAsCss(palette);
    case 'scss':
      return exportAsScss(palette);
    case 'json':
      return exportAsJson(palette);
    default:
      return exportAsHex(palette);
  }
}

/**
 * Download exported palette as a file
 */
export function downloadPalette(palette: PaletteColor[], format: ExportFormat): void {
  const content = exportPalette(palette, format);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const extension = format === 'scss' ? 'scss' : format === 'css' ? 'css' : format === 'json' ? 'json' : 'txt';
  link.download = `palette.${extension}`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Copy palette to clipboard
 */
export async function copyToClipboard(palette: PaletteColor[], format: ExportFormat): Promise<boolean> {
  try {
    const content = exportPalette(palette, format);
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
