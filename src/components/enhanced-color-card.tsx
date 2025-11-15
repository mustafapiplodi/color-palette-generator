import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Lock,
  Unlock,
  Check,
  AlertCircle,
  Sun,
  ChevronDown,
  ChevronUp,
  Pipette,
} from 'lucide-react';
import type { PaletteColor } from '@/utils/colorTheory';
import { getContrastRatio } from '@/utils/colorTheory';
import { getColorName, getColorTemperature, getColorBrightness } from '@/utils/colorHelpers';
import { useState } from 'react';
import { toast } from 'sonner';

interface EnhancedColorCardProps {
  color: PaletteColor;
  index: number;
  isSelected: boolean;
  copiedIndex: number | null;
  onSelect: () => void;
  onToggleLock: () => void;
  onCopy: () => void;
  onAdjust: (type: 'h' | 's' | 'l', value: number) => void;
  contrastWith?: string;
}

export function EnhancedColorCard({
  color,
  index,
  isSelected,
  onSelect,
  onToggleLock,
  onAdjust,
  contrastWith,
}: EnhancedColorCardProps) {
  const colorName = getColorName(color.hex);
  const temperature = getColorTemperature(color.hex);
  const brightness = getColorBrightness(color.hex);
  const [justCopied, setJustCopied] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string>('');

  const contrast = contrastWith ? getContrastRatio(contrastWith, color.hex) : null;

  const tempIcon = {
    warm: '🔥',
    cool: '❄️',
    neutral: '⚖️',
  }[temperature];

  const contrastCheck = contrast
    ? {
        ratio: contrast.toFixed(2),
        passAA: contrast >= 4.5,
        passAAA: contrast >= 7,
      }
    : null;

  // One-click copy handler with animation
  const handleQuickCopy = async (e: React.MouseEvent, format: 'hex' | 'rgb' | 'hsl' = 'hex') => {
    e.stopPropagation();
    let textToCopy = '';
    let formatLabel = '';

    switch (format) {
      case 'hex':
        textToCopy = color.hex;
        formatLabel = 'HEX';
        break;
      case 'rgb':
        textToCopy = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        formatLabel = 'RGB';
        break;
      case 'hsl':
        textToCopy = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
        formatLabel = 'HSL';
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setJustCopied(true);
      setCopiedFormat(formatLabel);
      toast.success(`Copied ${formatLabel}: ${textToCopy}`);
      setTimeout(() => {
        setJustCopied(false);
        setCopiedFormat('');
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={justCopied ? 'animate-pulse' : ''}
    >
      <Card
        className={`overflow-hidden hover:shadow-xl transition-all ${
          isSelected ? 'ring-2 ring-primary' : ''
        } ${justCopied ? 'ring-2 ring-green-500' : ''}`}
      >
        <div
          className="h-40 relative group cursor-pointer"
          style={{ backgroundColor: color.hex }}
          onClick={(e) => handleQuickCopy(e, 'hex')}
          title="Click to copy HEX"
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Copy Feedback Overlay */}
          {justCopied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            >
              <div className="bg-background rounded-full p-4 shadow-lg">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </motion.div>
          )}

          {/* Lock Button - Larger for touch */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-90 hover:opacity-100 h-11 w-11"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
          >
            {color.locked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Unlock className="h-5 w-5" />
            )}
          </Button>

          {/* Expand/Collapse Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-2 right-2 opacity-90 hover:opacity-100 h-9 w-9"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            title={isSelected ? "Collapse details" : "Expand details"}
          >
            {isSelected ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {/* Copied Badge */}
          {justCopied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 left-2"
            >
              <Badge className="bg-green-500 text-white">
                Copied {copiedFormat}!
              </Badge>
            </motion.div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Color Info - Always Visible */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {color.role}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-semibold text-sm">{color.hex}</span>
            </div>

            {/* Quick Copy Format Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleQuickCopy(e, 'hex')}
                className="flex-1 h-8 text-xs"
              >
                HEX
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleQuickCopy(e, 'rgb')}
                className="flex-1 h-8 text-xs"
              >
                RGB
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleQuickCopy(e, 'hsl')}
                className="flex-1 h-8 text-xs"
              >
                HSL
              </Button>
            </div>
          </div>

          {/* Expanded Details - Only when selected */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {/* Color Name and Temperature */}
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {colorName}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs flex items-center gap-1" title={temperature}>
                    {tempIcon} {temperature}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    <Sun className="h-3 w-3 mr-1" />
                    {brightness}%
                  </Badge>
                </div>
              </div>

              {/* Color Values */}
              <div className="text-xs space-y-0.5 text-muted-foreground">
                <div>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</div>
                <div>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</div>
              </div>

              {/* Contrast Info */}
              {contrastCheck && (
                <div className="text-xs border-t pt-2">
                  <div className="flex items-center gap-1 mb-1">
                    {contrastCheck.passAA ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                    )}
                    <span>Contrast: {contrastCheck.ratio}:1</span>
                  </div>
                  <Badge
                    variant={contrastCheck.passAAA ? 'success' : contrastCheck.passAA ? 'warning' : 'destructive'}
                    className="text-xs"
                  >
                    {contrastCheck.passAAA ? 'AAA' : contrastCheck.passAA ? 'AA' : 'Fail'}
                  </Badge>
                </div>
              )}
            </motion.div>
          )}

          {/* Color Picker Popover */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t"
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Pipette className="h-4 w-4" />
                    Adjust Color
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Fine-tune Color</h4>

                    {/* Hue Slider + Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">Hue</label>
                        <Input
                          type="number"
                          value={color.hsl.h}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onAdjust('h', Math.max(0, Math.min(360, val)));
                          }}
                          className="w-16 h-7 text-xs"
                          min={0}
                          max={360}
                        />
                      </div>
                      <Slider
                        value={[color.hsl.h]}
                        onValueChange={([v]) => onAdjust('h', v)}
                        min={0}
                        max={360}
                        step={1}
                        className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-red-500 [&_[role=slider]]:via-yellow-500 [&_[role=slider]]:via-green-500 [&_[role=slider]]:via-cyan-500 [&_[role=slider]]:via-blue-500 [&_[role=slider]]:to-red-500"
                      />
                    </div>

                    {/* Saturation Slider + Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">Saturation</label>
                        <Input
                          type="number"
                          value={color.hsl.s}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onAdjust('s', Math.max(0, Math.min(100, val)));
                          }}
                          className="w-16 h-7 text-xs"
                          min={0}
                          max={100}
                        />
                      </div>
                      <Slider
                        value={[color.hsl.s]}
                        onValueChange={([v]) => onAdjust('s', v)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    {/* Lightness Slider + Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">Lightness</label>
                        <Input
                          type="number"
                          value={color.hsl.l}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onAdjust('l', Math.max(0, Math.min(100, val)));
                          }}
                          className="w-16 h-7 text-xs"
                          min={0}
                          max={100}
                        />
                      </div>
                      <Slider
                        value={[color.hsl.l]}
                        onValueChange={([v]) => onAdjust('l', v)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    {/* RGB Inputs */}
                    <div className="pt-2 border-t">
                      <label className="text-xs text-muted-foreground block mb-2">RGB Values</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">R</label>
                          <Input
                            type="number"
                            value={color.rgb.r}
                            readOnly
                            className="h-8 text-xs bg-muted"
                            min={0}
                            max={255}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">G</label>
                          <Input
                            type="number"
                            value={color.rgb.g}
                            readOnly
                            className="h-8 text-xs bg-muted"
                            min={0}
                            max={255}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">B</label>
                          <Input
                            type="number"
                            value={color.rgb.b}
                            readOnly
                            className="h-8 text-xs bg-muted"
                            min={0}
                            max={255}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color Preview */}
                    <div className="pt-2 border-t">
                      <label className="text-xs text-muted-foreground block mb-2">Preview</label>
                      <div
                        className="h-12 rounded border"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
