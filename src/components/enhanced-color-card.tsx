import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  AlertCircle,
  Sun,
} from 'lucide-react';
import type { PaletteColor } from '@/utils/colorTheory';
import { getContrastRatio } from '@/utils/colorTheory';
import { getColorName, getColorTemperature, getColorBrightness, getOptimalTextColor } from '@/utils/colorHelpers';

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
  copiedIndex,
  onSelect,
  onToggleLock,
  onCopy,
  onAdjust,
  contrastWith,
}: EnhancedColorCardProps) {
  const colorName = getColorName(color.hex);
  const temperature = getColorTemperature(color.hex);
  const brightness = getColorBrightness(color.hex);
  const textColor = getOptimalTextColor(color.hex);

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className={`overflow-hidden hover:shadow-xl transition-all ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
      >
        <div
          className="h-40 cursor-pointer relative group"
          style={{ backgroundColor: color.hex }}
          onClick={onSelect}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Lock Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-90 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
          >
            {color.locked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </Button>

          {/* Text Preview */}
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            <p
              className="text-xs font-semibold"
              style={{ color: textColor }}
            >
              Text Preview
            </p>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                style={{ backgroundColor: '#fff', color: color.hex }}
                className="text-xs"
              >
                On White
              </Badge>
              <Badge
                variant="outline"
                style={{ backgroundColor: '#000', color: color.hex }}
                className="text-xs"
              >
                On Black
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Color Info - Always Visible */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {color.role}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-sm">{color.hex}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={onCopy}
                className="h-7 w-7"
              >
                {copiedIndex === index ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
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

          {/* HSL Sliders */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-3 border-t"
            >
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Hue: {color.hsl.h}°
                </label>
                <Slider
                  value={[color.hsl.h]}
                  onValueChange={([v]) => onAdjust('h', v)}
                  min={0}
                  max={360}
                  step={1}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Saturation: {color.hsl.s}%
                </label>
                <Slider
                  value={[color.hsl.s]}
                  onValueChange={([v]) => onAdjust('s', v)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Lightness: {color.hsl.l}%
                </label>
                <Slider
                  value={[color.hsl.l]}
                  onValueChange={([v]) => onAdjust('l', v)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
