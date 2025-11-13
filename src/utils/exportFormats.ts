import { PaletteColor } from './colorTheory';

export type ExportFormat =
  | 'hex'
  | 'rgb'
  | 'hsl'
  | 'css'
  | 'scss'
  | 'json'
  | 'tailwind'
  | 'materialui'
  | 'android'
  | 'ios'
  | 'svg'
  | 'markdown';

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
 * Export palette as Tailwind CSS config
 */
export function exportAsTailwind(palette: PaletteColor[]): string {
  const colors = palette
    .map(color => `        ${color.role}: '${color.hex}',`)
    .join('\n');

  return `module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      },
    },
  },
};`;
}

/**
 * Export palette as Material-UI theme
 */
export function exportAsMaterialUI(palette: PaletteColor[]): string {
  const primary = palette.find(c => c.role === 'primary') || palette[0];
  const secondary = palette.find(c => c.role === 'secondary') || palette[1];

  return `import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '${primary.hex}',
    },
    secondary: {
      main: '${secondary.hex}',
    },
${palette.slice(2).map(color => `    ${color.role}: {
      main: '${color.hex}',
    },`).join('\n')}
  },
});`;
}

/**
 * Export palette as Android XML colors
 */
export function exportAsAndroid(palette: PaletteColor[]): string {
  const colors = palette
    .map(color => `    <color name="${color.role}">${color.hex}</color>`)
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
${colors}
</resources>`;
}

/**
 * Export palette as iOS Swift colors
 */
export function exportAsIOS(palette: PaletteColor[]): string {
  const colors = palette
    .map(color => {
      const rgb = color.rgb;
      return `    static let ${color.role} = UIColor(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)}, alpha: 1.0)`;
    })
    .join('\n');

  return `import UIKit

extension UIColor {
${colors}
}`;
}

/**
 * Export palette as SVG
 */
export function exportAsSVG(palette: PaletteColor[]): string {
  const width = 100;
  const height = 100 * palette.length;
  const rects = palette
    .map((color, index) => `  <rect x="0" y="${index * 100}" width="${width}" height="100" fill="${color.hex}"/>`)
    .join('\n');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
${rects}
</svg>`;
}

/**
 * Export palette as Markdown table
 */
export function exportAsMarkdown(palette: PaletteColor[]): string {
  const header = '| Role | Color | HEX | RGB | HSL |';
  const separator = '|------|-------|-----|-----|-----|';
  const rows = palette
    .map(color => {
      const preview = `![](https://via.placeholder.com/30x20/${color.hex.replace('#', '')}/000000?text=+)`;
      return `| ${color.role} | ${preview} | ${color.hex} | rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}) | hsl(${color.hsl.h}°, ${color.hsl.s}%, ${color.hsl.l}%) |`;
    })
    .join('\n');

  return `${header}\n${separator}\n${rows}`;
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
    case 'tailwind':
      return exportAsTailwind(palette);
    case 'materialui':
      return exportAsMaterialUI(palette);
    case 'android':
      return exportAsAndroid(palette);
    case 'ios':
      return exportAsIOS(palette);
    case 'svg':
      return exportAsSVG(palette);
    case 'markdown':
      return exportAsMarkdown(palette);
    default:
      return exportAsHex(palette);
  }
}

/**
 * Download exported palette as a file
 */
export function downloadPalette(palette: PaletteColor[], format: ExportFormat): void {
  const content = exportPalette(palette, format);
  const mimeType = format === 'svg' ? 'image/svg+xml' : 'text/plain';
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const extensionMap: Record<ExportFormat, string> = {
    hex: 'txt',
    rgb: 'txt',
    hsl: 'txt',
    css: 'css',
    scss: 'scss',
    json: 'json',
    tailwind: 'js',
    materialui: 'ts',
    android: 'xml',
    ios: 'swift',
    svg: 'svg',
    markdown: 'md',
  };

  link.download = `palette.${extensionMap[format] || 'txt'}`;
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
