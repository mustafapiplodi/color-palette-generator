import { useState, useEffect, useCallback, useRef } from 'react';
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
import { CollapsibleSection } from './components/collapsible-section';
import { HarmonySelector } from './components/harmony-selector';
import { AriaAnnouncer } from './components/aria-announcer';
import { MobileExportSheet } from './components/mobile-export-sheet';
import { Breadcrumb } from './components/breadcrumb';
import { FeaturesSection } from './components/features-section';
import { AboutSection } from './components/about-section';
import { FAQSection } from './components/faq-section';
import { AboutFooter } from './components/about-footer';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  generatePalette,
  generateRandomColor,
  hexToPaletteColor,
  adjustColor,
  type HarmonyType,
  type PaletteColor,
} from './utils/colorTheory';
import { copyToClipboard, downloadPalette, exportPalette, type ExportFormat } from './utils/exportFormats';
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
import { useOnboardingTour } from './hooks/useOnboardingTour';

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
  const [activeTab, setActiveTab] = useLocalStorage<string>('activeTab', 'palette');
  const [ariaMessage, setAriaMessage] = useState<string>('');
  const [hasSeenTour, setHasSeenTour] = useLocalStorage<boolean>('hasSeenTour', false);

  // Dialogs
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // History
  const { addToHistory, undo, redo, canUndo, canRedo } = usePaletteHistory();

  // Track if initial load has happened to prevent duplicate toasts
  const hasInitialized = useRef(false);

  // Load palette from URL on mount
  useEffect(() => {
    // Prevent duplicate execution in React Strict Mode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

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
        // Generate initial palette without toast
        const baseColor = generateRandomColor();
        const colors = generatePalette(baseColor, harmonyType);
        const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
        const newPalette = colors.map((hex, index) =>
          hexToPaletteColor(hex, `color-${index}`, roles[index], false)
        );
        setPalette(newPalette);
        addToHistory(newPalette, harmonyType);
      }
    } else {
      // Generate initial palette without toast
      const baseColor = generateRandomColor();
      const colors = generatePalette(baseColor, harmonyType);
      const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
      const newPalette = colors.map((hex, index) =>
        hexToPaletteColor(hex, `color-${index}`, roles[index], false)
      );
      setPalette(newPalette);
      addToHistory(newPalette, harmonyType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    addToHistory(newPalette, harmonyType);
    toast.success('Random color palette generated!');
    setAriaMessage(`New ${harmonyType} palette generated with ${newPalette.length} colors`);
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
    addToHistory(newPalette, type);
    setAriaMessage(`Harmony changed to ${type}`);
  };

  const toggleLock = (id: string) => {
    setPalette(prev => {
      const newPalette = prev.map(color =>
        color.id === id ? { ...color, locked: !color.locked } : color
      );
      addToHistory(newPalette, harmonyType);
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
      addToHistory(newPalette, harmonyType);
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
    addToHistory(newPalette, harmonyType);
    toast.success('Colors extracted from image!');
  };

  const handleColorSelected = (color: string) => {
    const colors = generatePalette(color, harmonyType);
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
    const newPalette = colors.map((hex, index) =>
      hexToPaletteColor(hex, `color-${index}`, roles[index], false)
    );
    setPalette(newPalette);
    addToHistory(newPalette, harmonyType);
    toast.success('Palette generated from your color!');
  };

  const handleTemplateSelected = (colors: string[]) => {
    const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'support'];
    const newPalette = colors.slice(0, 5).map((hex, index) =>
      hexToPaletteColor(hex, `color-${index}`, roles[index], false)
    );
    setPalette(newPalette);
    addToHistory(newPalette, harmonyType);
    toast.success('Template applied!');
  };

  // Quick Actions
  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setPalette(previousState.palette);
      setHarmonyType(previousState.harmonyType);
      toast.info('Undo');
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setPalette(nextState.palette);
      setHarmonyType(nextState.harmonyType);
      toast.info('Redo');
    }
  };

  const handleReset = () => {
    handleGenerate();
  };

  const handleLockAll = () => {
    setPalette(prev => {
      const newPalette = prev.map(c => ({ ...c, locked: true }));
      addToHistory(newPalette, harmonyType);
      return newPalette;
    });
    toast.info('All colors locked');
  };

  const handleUnlockAll = () => {
    setPalette(prev => {
      const newPalette = prev.map(c => ({ ...c, locked: false }));
      addToHistory(newPalette, harmonyType);
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
      addToHistory(newPalette, harmonyType);
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
      addToHistory(newPalette, harmonyType);
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
      addToHistory(newPalette, harmonyType);
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
      addToHistory(newPalette, harmonyType);
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
      addToHistory(newPalette, harmonyType);
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
      addToHistory(newPalette, harmonyType);
      return newPalette;
    });
    toast.success('Saturation decreased!');
  };

  // Onboarding Tour
  useOnboardingTour(hasSeenTour, () => setHasSeenTour(true));

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
      <AriaAnnouncer message={ariaMessage} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Palette className="h-10 w-10" />
              Color Palette Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Create harmonious color schemes using color theory, image extraction, and accessibility tools
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

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Harmony Type Selection - Visual with Previews */}
        <Card data-tour="harmony-selector">
          <CardContent className="pt-6">
            <HarmonySelector
              value={harmonyType}
              onChange={(type) => handleHarmonyChange(type)}
              baseColor={palette[0]?.hex || '#3b82f6'}
            />
          </CardContent>
        </Card>

        {/* Main Actions - Simplified */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handleGenerate}
            size="lg"
            className="gap-2"
            data-tour="generate-button"
          >
            <Shuffle className="h-5 w-5" />
            Generate Palette
            <kbd className="ml-2 px-2 py-0.5 bg-primary-foreground/20 rounded text-xs">
              Space
            </kbd>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="lg" variant="outline" className="gap-2">
                <Sparkles className="h-5 w-5" />
                More Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem onClick={() => setShowColorPicker(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Pick Base Color
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTemplates(true)}>
                <BookTemplate className="h-4 w-4 mr-2" />
                Choose Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Palette
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Actions Toolbar */}
        <div data-tour="quick-actions">
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
        </div>

        {/* Tabbed Content Layout */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-tour="tabs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="palette">Palette</TabsTrigger>
            <TabsTrigger value="adjust">Extract</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Tab 1: Palette Display & Image Upload */}
          <TabsContent value="palette" className="space-y-4">
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

            {/* Quick Copy All HEX */}
            {palette.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const hexColors = palette.map(c => c.hex).join(', ');
                    try {
                      await navigator.clipboard.writeText(hexColors);
                      toast.success('All colors copied as HEX!');
                    } catch (err) {
                      toast.error('Failed to copy colors');
                    }
                  }}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy All HEX Colors
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Adjust - Image Upload */}
          <TabsContent value="adjust" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Extract from Image</CardTitle>
                <CardDescription>
                  Upload an image to extract its dominant colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload onColorsExtracted={handleImageColors} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Export Section */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Palette</CardTitle>
                <CardDescription>
                  Export your palette in various formats for different workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm font-medium whitespace-nowrap">Format:</label>
                  <div className="flex gap-2 flex-wrap flex-1">
                    {/* Top 3 most common formats */}
                    <Button
                      variant={exportFormat === 'hex' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setExportFormat('hex')}
                    >
                      HEX
                    </Button>
                    <Button
                      variant={exportFormat === 'css' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setExportFormat('css')}
                    >
                      CSS
                    </Button>
                    <Button
                      variant={exportFormat === 'tailwind' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setExportFormat('tailwind')}
                    >
                      Tailwind
                    </Button>

                    {/* More formats in Select dropdown */}
                    <Select
                      value={exportFormat}
                      onValueChange={(value) => setExportFormat(value as ExportFormat)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="More formats..." />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPORT_FORMATS.filter(f => !['hex', 'css', 'tailwind'].includes(f.value)).map(format => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Export Preview */}
                <div className="mt-4">
                  <label className="text-sm font-medium block mb-2">Preview</label>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-64 overflow-y-auto border">
                      <code>{exportPalette(palette, exportFormat)}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={async () => {
                        const text = exportPalette(palette, exportFormat);
                        await navigator.clipboard.writeText(text);
                        toast.success('Preview copied!');
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
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
          </TabsContent>

          {/* Tab 4: Advanced Features */}
          <TabsContent value="advanced" className="space-y-4">
            {palette.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Palette Metrics</CardTitle>
                    <CardDescription>
                      View accessibility, harmony, and uniqueness scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaletteMetrics palette={palette} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gradient Generator</CardTitle>
                    <CardDescription>
                      Create beautiful gradients from your palette colors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GradientGenerator palette={palette} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Color Wheel</CardTitle>
                    <CardDescription>
                      Visualize your palette on the color wheel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ColorWheel palette={palette} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>UI Preview</CardTitle>
                    <CardDescription>
                      See how your palette looks on real UI elements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UIMockupPreview palette={palette} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Generate a palette to see advanced features
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      </div>

      {/* SEO Content Sections */}
      <FeaturesSection />
      <AboutSection />
      <FAQSection />
      <AboutFooter />

      {/* Mobile Export Sheet */}
      {palette.length > 0 && (
        <MobileExportSheet
          palette={palette}
          exportFormat={exportFormat}
          onFormatChange={setExportFormat}
          onDownload={handleDownload}
          onCopy={handleExport}
        />
      )}

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
