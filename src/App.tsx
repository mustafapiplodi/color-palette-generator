import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { ThemeToggle } from './components/theme-toggle';
import { ImageUpload } from './components/image-upload';
import { EnhancedColorCard } from './components/enhanced-color-card';
import { QuickActionsToolbar } from './components/quick-actions-toolbar';
import { KeyboardShortcutsDialog } from './components/keyboard-shortcuts-dialog';
import { ColorInputDialog } from './components/color-input-dialog';
import { ShareDialog } from './components/share-dialog';
import { PaletteMetrics } from './components/palette-metrics';
import { TemplatesDialog } from './components/templates-dialog';
import { GradientGenerator } from './components/gradient-generator';
import { ColorWheel } from './components/color-wheel';
import { UIMockupPreview } from './components/ui-mockup-preview';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import {
  generatePalette,
  generateRandomColor,
  hexToPaletteColor,
  adjustColor,
  type HarmonyType,
  type PaletteColor,
} from './utils/colorTheory';
import { copyToClipboard, downloadPalette, type ExportFormat } from './utils/exportFormats';
import {
  lightenColor,
  darkenColor,
  saturateColor,
  desaturateColor,
  
  invertColor,
  decodePaletteFromURL,
  encodePaletteToURL,
} from './utils/colorHelpers';
import {
  Shuffle,
  Download,
  Copy,
  Palette,
  Share2,
  Sparkles,
  Keyboard as KeyboardIcon,
  BookTemplate,
} from 'lucide-react';
import { usePaletteHistory } from './hooks/usePaletteHistory';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const HARMONY_TYPES: { value: HarmonyType; label: string; description: string }[] = [
  { value: 'monochromatic', label: 'Monochromatic', description: 'Single hue variations' },
  { value: 'analogous', label: 'Analogous', description: 'Adjacent colors (±30°)' },
  { value: 'complementary', label: 'Complementary', description: 'Opposite (180°)' },
  { value: 'triadic', label: 'Triadic', description: '120° spacing' },
  { value: 'tetradic', label: 'Tetradic', description: 'Two pairs' },
];

const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'tailwind', label: 'Tailwind' },
  { value: 'materialui', label: 'Material-UI' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
  { value: 'svg', label: 'SVG' },
  { value: 'markdown', label: 'Markdown' },
];

function App() {
  const [harmonyType, setHarmonyType] = useLocalStorage<HarmonyType>('harmonyType', 'complementary');
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useLocalStorage<ExportFormat>('exportFormat', 'hex');

  // Dialogs
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // History
  const { addToHistory, undo, redo, canUndo, canRedo } = usePaletteHistory();

  // Load palette from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const colorsParam = params.get('colors');

    if (colorsParam) {
      try {
        const colors = decodePaletteFromURL(colorsParam);
        const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
        const newPalette = colors.slice(0, 5).map((hex, index) =>
          hexToPaletteColor(hex, `color-${index}`, roles[index], false)
        );
        setPalette(newPalette);
        toast.success('Palette loaded from URL!');
      } catch (err) {
        console.error('Failed to load palette from URL:', err);
        handleGenerate();
      }
    } else {
      handleGenerate();
    }
  }, []);

  // Update URL when palette changes
  useEffect(() => {
    if (palette.length > 0) {
      const colors = palette.map(c => c.hex);
      const encoded = encodePaletteToURL(colors);
      const newUrl = `${window.location.pathname}?colors=${encoded}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [palette]);

  const handleGenerate = useCallback(() => {
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
    addToHistory(newPalette);
    toast.success('New palette generated!');
  }, [harmonyType, palette, addToHistory]);

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
    addToHistory(newPalette);
  };

  const toggleLock = (id: string) => {
    setPalette(prev => {
      const newPalette = prev.map(color =>
        color.id === id ? { ...color, locked: !color.locked } : color
      );
      addToHistory(newPalette);
      return newPalette;
    });
  };

  const handleColorAdjustment = (id: string, type: 'h' | 's' | 'l', value: number) => {
    setPalette(prev => {
      const newPalette = prev.map(color => {
        if (color.id !== id) return color;

        const adjustments = {
          h: type === 'h' ? value : color.hsl.h,
          s: type === 's' ? value : color.hsl.s,
          l: type === 'l' ? value : color.hsl.l,
        };

        const newHex = adjustColor(color.hex, adjustments);
        return hexToPaletteColor(newHex, color.id, color.role, color.locked);
      });
      addToHistory(newPalette);
      return newPalette;
    });
  };

  const copyColor = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast.success(`Copied ${hex}`);
    } catch (error) {
      toast.error('Failed to copy color');
    }
  };

  const handleExport = async () => {
    const success = await copyToClipboard(palette, exportFormat);
    if (success) {
      toast.success(`Copied as ${exportFormat.toUpperCase()}!`);
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    downloadPalette(palette, exportFormat);
    toast.success(`Downloaded as ${exportFormat.toUpperCase()}!`);
  };

  const handleImageColors = (colors: string[]) => {
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
    const newPalette = colors.slice(0, 5).map((hex, index) =>
      hexToPaletteColor(hex, `color-${index}`, roles[index], false)
    );
    setPalette(newPalette);
    addToHistory(newPalette);
    toast.success('Colors extracted from image!');
  };

  const handleColorSelected = (color: string) => {
    const colors = generatePalette(color, harmonyType);
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
    const newPalette = colors.map((hex, index) =>
      hexToPaletteColor(hex, `color-${index}`, roles[index], false)
    );
    setPalette(newPalette);
    addToHistory(newPalette);
    toast.success('Palette generated from your color!');
  };

  const handleTemplateSelected = (colors: string[]) => {
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
    const newPalette = colors.slice(0, 5).map((hex, index) =>
      hexToPaletteColor(hex, `color-${index}`, roles[index], false)
    );
    setPalette(newPalette);
    addToHistory(newPalette);
    toast.success('Template applied!');
  };

  // Quick Actions
  const handleUndo = () => {
    const previousPalette = undo();
    if (previousPalette) {
      setPalette(previousPalette);
      toast.info('Undo');
    }
  };

  const handleRedo = () => {
    const nextPalette = redo();
    if (nextPalette) {
      setPalette(nextPalette);
      toast.info('Redo');
    }
  };

  const handleReset = () => {
    handleGenerate();
  };

  const handleLockAll = () => {
    setPalette(prev => {
      const newPalette = prev.map(c => ({ ...c, locked: true }));
      addToHistory(newPalette);
      return newPalette;
    });
    toast.info('All colors locked');
  };

  const handleUnlockAll = () => {
    setPalette(prev => {
      const newPalette = prev.map(c => ({ ...c, locked: false }));
      addToHistory(newPalette);
      return newPalette;
    });
    toast.info('All colors unlocked');
  };

  const handleRandomizeSingle = () => {
    const unlockedIndices = palette.map((c, i) => c.locked ? -1 : i).filter(i => i >= 0);
    if (unlockedIndices.length === 0) {
      toast.error('All colors are locked!');
      return;
    }

    const randomIndex = unlockedIndices[Math.floor(Math.random() * unlockedIndices.length)];
    setPalette(prev => {
      const newPalette = [...prev];
      newPalette[randomIndex] = hexToPaletteColor(
        generateRandomColor(),
        newPalette[randomIndex].id,
        newPalette[randomIndex].role,
        false
      );
      addToHistory(newPalette);
      return newPalette;
    });
    toast.success('Randomized one color!');
  };

  const handleInvertColors = () => {
    setPalette(prev => {
      const newPalette = prev.map(color => {
        const inverted = invertColor(color.hex);
        return hexToPaletteColor(inverted, color.id, color.role, color.locked);
      });
      addToHistory(newPalette);
      return newPalette;
    });
    toast.success('Colors inverted!');
  };

  const handleLighten = () => {
    setPalette(prev => {
      const newPalette = prev.map(color => {
        const lightened = lightenColor(color.hex, 10);
        return hexToPaletteColor(lightened, color.id, color.role, color.locked);
      });
      addToHistory(newPalette);
      return newPalette;
    });
    toast.success('Colors lightened!');
  };

  const handleDarken = () => {
    setPalette(prev => {
      const newPalette = prev.map(color => {
        const darkened = darkenColor(color.hex, 10);
        return hexToPaletteColor(darkened, color.id, color.role, color.locked);
      });
      addToHistory(newPalette);
      return newPalette;
    });
    toast.success('Colors darkened!');
  };

  const handleSaturate = () => {
    setPalette(prev => {
      const newPalette = prev.map(color => {
        const saturated = saturateColor(color.hex, 10);
        return hexToPaletteColor(saturated, color.id, color.role, color.locked);
      });
      addToHistory(newPalette);
      return newPalette;
    });
    toast.success('Saturation increased!');
  };

  const handleDesaturate = () => {
    setPalette(prev => {
      const newPalette = prev.map(color => {
        const desaturated = desaturateColor(color.hex, 10);
        return hexToPaletteColor(desaturated, color.id, color.role, color.locked);
      });
      addToHistory(newPalette);
      return newPalette;
    });
    toast.success('Saturation decreased!');
  };

  // Keyboard Shortcuts
  useKeyboardShortcuts([
    { key: ' ', handler: handleGenerate, description: 'Generate new palette' },
    { key: 'z', ctrl: true, handler: handleUndo, description: 'Undo' },
    { key: 'y', ctrl: true, handler: handleRedo, description: 'Redo' },
    { key: 'y', ctrl: true, shift: true, handler: handleRedo, description: 'Redo (alt)' },
    { key: 'r', handler: handleReset, description: 'Reset palette' },
    { key: 'i', handler: handleInvertColors, description: 'Invert colors' },
    { key: '?', handler: () => setShowShortcuts(true), description: 'Show shortcuts' },
    { key: '1', handler: () => setSelectedColorId(palette[0]?.id || null), description: 'Select color 1' },
    { key: '2', handler: () => setSelectedColorId(palette[1]?.id || null), description: 'Select color 2' },
    { key: '3', handler: () => setSelectedColorId(palette[2]?.id || null), description: 'Select color 3' },
    { key: '4', handler: () => setSelectedColorId(palette[3]?.id || null), description: 'Select color 4' },
    { key: '5', handler: () => setSelectedColorId(palette[4]?.id || null), description: 'Select color 5' },
  ]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Toaster position="top-center" richColors />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Palette className="h-10 w-10" />
              Color Palette Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Create harmonious color schemes with advanced tools and AI features
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowShortcuts(true)}
              title="Keyboard Shortcuts (?)"
            >
              <KeyboardIcon className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Harmony Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Color Harmony</CardTitle>
            <CardDescription>
              Select a color theory model to generate harmonious palettes
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

        {/* Main Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handleGenerate}
            size="lg"
            className="gap-2"
          >
            <Shuffle className="h-5 w-5" />
            Generate Palette
            <kbd className="ml-2 px-2 py-0.5 bg-primary-foreground/20 rounded text-xs">
              Space
            </kbd>
          </Button>
          <Button
            onClick={() => setShowColorPicker(true)}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Pick Base Color
          </Button>
          <Button
            onClick={() => setShowTemplates(true)}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <BookTemplate className="h-5 w-5" />
            Templates
          </Button>
          <Button
            onClick={() => setShowShareDialog(true)}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>

        {/* Quick Actions Toolbar */}
        <QuickActionsToolbar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={handleReset}
          onLockAll={handleLockAll}
          onUnlockAll={handleUnlockAll}
          onRandomizeSingle={handleRandomizeSingle}
          onInvertColors={handleInvertColors}
          onLighten={handleLighten}
          onDarken={handleDarken}
          onSaturate={handleSaturate}
          onDesaturate={handleDesaturate}
          palette={palette}
        />

        {/* Image Upload */}
        <ImageUpload onColorsExtracted={handleImageColors} />

        {/* Color Palette Display */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {palette.map((color, index) => (
            <EnhancedColorCard
              key={color.id}
              color={color}
              index={index}
              isSelected={selectedColorId === color.id}
              copiedIndex={copiedIndex}
              onSelect={() => setSelectedColorId(selectedColorId === color.id ? null : color.id)}
              onToggleLock={() => toggleLock(color.id)}
              onCopy={() => copyColor(color.hex, index)}
              onAdjust={(type, value) => handleColorAdjustment(color.id, type, value)}
              contrastWith={palette[0]?.hex}
            />
          ))}
        </div>

        {/* Palette Metrics */}
        {palette.length > 0 && <PaletteMetrics palette={palette} />}

        {/* Gradient Generator */}
        {palette.length > 0 && <GradientGenerator palette={palette} />}

        {/* Color Wheel Visualization */}
        {palette.length > 0 && <ColorWheel palette={palette} />}

        {/* UI Mockup Preview */}
        {palette.length > 0 && <UIMockupPreview palette={palette} />}

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle>Export Palette</CardTitle>
            <CardDescription>
              Export your palette in various formats for different workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {EXPORT_FORMATS.map(format => (
                <Button
                  key={format.value}
                  variant={exportFormat === format.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportFormat(format.value)}
                >
                  {format.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-3">
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
        <div className="text-center text-sm text-muted-foreground py-6 border-t">
          <p>
            Built with React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Chroma.js
          </p>
          <p className="mt-2">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> for keyboard shortcuts
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <KeyboardShortcutsDialog
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
      />
      <ColorInputDialog
        open={showColorPicker}
        onOpenChange={setShowColorPicker}
        onColorSelected={handleColorSelected}
      />
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        palette={palette}
      />
      <TemplatesDialog
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelectTemplate={handleTemplateSelected}
      />
    </div>
  );
}

export default App;
