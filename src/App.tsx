import { useState, useEffect } from 'react';
import { ThemeToggle } from './components/theme-toggle';
import { ImageUpload } from './components/image-upload';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Slider } from './components/ui/slider';
import {
  generatePalette,
  generateRandomColor,
  hexToPaletteColor,
  adjustColor,
  getContrastRatio,
  type HarmonyType,
  type PaletteColor,
} from './utils/colorTheory';
import { copyToClipboard, downloadPalette, type ExportFormat } from './utils/exportFormats';
import {
  Shuffle,
  Lock,
  Unlock,
  Copy,
  Download,
  Check,
  Palette,
  AlertCircle,
} from 'lucide-react';

const HARMONY_TYPES: { value: HarmonyType; label: string; description: string }[] = [
  { value: 'monochromatic', label: 'Monochromatic', description: 'Variations of a single hue' },
  { value: 'analogous', label: 'Analogous', description: 'Adjacent colors (±30°)' },
  { value: 'complementary', label: 'Complementary', description: 'Opposite colors (180°)' },
  { value: 'triadic', label: 'Triadic', description: 'Three colors (120° apart)' },
  { value: 'tetradic', label: 'Tetradic', description: 'Two complementary pairs' },
];

const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'css', label: 'CSS Variables' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
];

function App() {
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('hex');

  // Generate initial palette
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    const baseColor = generateRandomColor();
    const colors = generatePalette(baseColor, harmonyType);
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];

    const newPalette = colors.map((hex, index) => {
      const existingColor = palette[index];
      if (existingColor?.locked) {
        return existingColor;
      }
      return hexToPaletteColor(hex, `color-${index}`, roles[index], false);
    });

    setPalette(newPalette);
  };

  const handleHarmonyChange = (type: HarmonyType) => {
    setHarmonyType(type);
    const unlockedBaseIndex = palette.findIndex(c => !c.locked);
    const baseColor = unlockedBaseIndex >= 0 ? palette[unlockedBaseIndex].hex : generateRandomColor();
    const colors = generatePalette(baseColor, type);
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];

    const newPalette = colors.map((hex, index) => {
      const existingColor = palette[index];
      if (existingColor?.locked) {
        return existingColor;
      }
      return hexToPaletteColor(hex, `color-${index}`, roles[index], false);
    });

    setPalette(newPalette);
  };

  const toggleLock = (id: string) => {
    setPalette(prev =>
      prev.map(color =>
        color.id === id ? { ...color, locked: !color.locked } : color
      )
    );
  };

  const handleColorAdjustment = (
    id: string,
    type: 'h' | 's' | 'l',
    value: number
  ) => {
    setPalette(prev =>
      prev.map(color => {
        if (color.id !== id) return color;

        const adjustments = {
          h: type === 'h' ? value : color.hsl.h,
          s: type === 's' ? value : color.hsl.s,
          l: type === 'l' ? value : color.hsl.l,
        };

        const newHex = adjustColor(color.hex, adjustments);
        return hexToPaletteColor(newHex, color.id, color.role, color.locked);
      })
    );
  };

  const copyColor = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExport = async () => {
    await copyToClipboard(palette, exportFormat);
  };

  const handleDownload = () => {
    downloadPalette(palette, exportFormat);
  };

  const handleImageColors = (colors: string[]) => {
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
    const newPalette = colors.slice(0, 5).map((hex, index) =>
      hexToPaletteColor(hex, `color-${index}`, roles[index], false)
    );
    setPalette(newPalette);
  };

  const checkContrast = (color1: string, color2: string) => {
    const ratio = getContrastRatio(color1, color2);
    return {
      ratio: ratio.toFixed(2),
      passAA: ratio >= 4.5,
      passAAA: ratio >= 7,
    };
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      handleGenerate();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [palette, harmonyType]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Palette className="h-10 w-10" />
              Color Palette Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Create harmonious color schemes with AI-driven features and color theory
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Harmony Type</CardTitle>
            <CardDescription>
              Select a color harmony model based on color wheel relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {HARMONY_TYPES.map(type => (
                <Button
                  key={type.value}
                  variant={harmonyType === type.value ? 'default' : 'outline'}
                  onClick={() => handleHarmonyChange(type.value)}
                  className="flex flex-col h-auto py-3"
                >
                  <span className="font-semibold">{type.label}</span>
                  <span className="text-xs opacity-70 font-normal">
                    {type.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleGenerate}
            size="lg"
            className="gap-2 text-lg px-8"
          >
            <Shuffle className="h-5 w-5" />
            Generate Palette
            <span className="text-xs opacity-70">(or press Space)</span>
          </Button>
        </div>

        {/* Image Upload */}
        <ImageUpload onColorsExtracted={handleImageColors} />

        {/* Color Palette Display */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {palette.map((color, index) => {
            const contrast = index > 0 ? checkContrast(palette[0].hex, color.hex) : null;

            return (
              <Card
                key={color.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-32 cursor-pointer relative group"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(selectedColor === color.id ? null : color.id)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(color.id);
                    }}
                  >
                    {color.locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {color.role}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold">{color.hex}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyColor(color.hex, index)}
                        className="h-8 w-8"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</div>
                    <div>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</div>
                  </div>

                  {contrast && (
                    <div className="text-xs border-t pt-2">
                      <div className="flex items-center gap-1 mb-1">
                        {contrast.passAA ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                        )}
                        <span>Contrast: {contrast.ratio}:1</span>
                      </div>
                      <div className="text-muted-foreground">
                        {contrast.passAAA ? 'AAA' : contrast.passAA ? 'AA' : 'Fail'}
                      </div>
                    </div>
                  )}

                  {selectedColor === color.id && (
                    <div className="space-y-3 pt-2 border-t">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Hue: {color.hsl.h}°
                        </label>
                        <Slider
                          value={[color.hsl.h]}
                          onValueChange={([v]) => handleColorAdjustment(color.id, 'h', v)}
                          min={0}
                          max={360}
                          step={1}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Saturation: {color.hsl.s}%
                        </label>
                        <Slider
                          value={[color.hsl.s]}
                          onValueChange={([v]) => handleColorAdjustment(color.id, 's', v)}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Lightness: {color.hsl.l}%
                        </label>
                        <Slider
                          value={[color.hsl.l]}
                          onValueChange={([v]) => handleColorAdjustment(color.id, 'l', v)}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle>Export Palette</CardTitle>
            <CardDescription>
              Export your palette in various formats for different workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {EXPORT_FORMATS.map(format => (
                <Button
                  key={format.value}
                  variant={exportFormat === format.value ? 'default' : 'outline'}
                  onClick={() => setExportFormat(format.value)}
                >
                  {format.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleExport} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pb-8">
          <p>
            Built with React, TypeScript, Tailwind CSS, shadcn/ui, and Chroma.js
          </p>
          <p className="mt-1">
            Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> to generate new palette
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
