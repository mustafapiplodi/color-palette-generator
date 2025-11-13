import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Copy, Check, Download } from 'lucide-react';
import type { PaletteColor } from '@/utils/colorTheory';
import chroma from 'chroma-js';

interface GradientGeneratorProps {
  palette: PaletteColor[];
}

type GradientType = 'linear' | 'radial';
type GradientDirection = 'to right' | 'to left' | 'to bottom' | 'to top' | 'to bottom right' | 'to bottom left';

export function GradientGenerator({ palette }: GradientGeneratorProps) {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [direction, setDirection] = useState<GradientDirection>('to right');
  const [selectedColors, setSelectedColors] = useState<number[]>([0, 1]);
  const [steps, setSteps] = useState(3);
  const [copied, setCopied] = useState(false);

  if (palette.length === 0) return null;

  const colors = selectedColors.map(i => palette[i]?.hex || '#000000');
  const gradient = gradientType === 'linear'
    ? `linear-gradient(${direction}, ${colors.join(', ')})`
    : `radial-gradient(circle, ${colors.join(', ')})`;

  // Generate intermediate colors
  const intermediateColors = selectedColors.length === 2
    ? chroma.scale([colors[0], colors[1]]).mode('lch').colors(steps)
    : colors;

  const cssCode = gradientType === 'linear'
    ? `background: linear-gradient(${direction}, ${colors.join(', ')});`
    : `background: radial-gradient(circle, ${colors.join(', ')});`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSVG = () => {
    const svg = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradientType === 'linear' ? `
    <linearGradient id="grad" x1="0%" y1="0%" x2="${direction.includes('right') ? '100%' : '0%'}" y2="${direction.includes('bottom') ? '100%' : '0%'}">
      ${colors.map((color, i) => `<stop offset="${(i / (colors.length - 1)) * 100}%" style="stop-color:${color};stop-opacity:1" />`).join('\n      ')}
    </linearGradient>` : `
    <radialGradient id="grad">
      ${colors.map((color, i) => `<stop offset="${(i / (colors.length - 1)) * 100}%" style="stop-color:${color};stop-opacity:1" />`).join('\n      ')}
    </radialGradient>`}
  </defs>
  <rect width="800" height="400" fill="url(#grad)" />
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'gradient.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleColorSelection = (index: number) => {
    if (selectedColors.includes(index)) {
      if (selectedColors.length > 2) {
        setSelectedColors(prev => prev.filter(i => i !== index));
      }
    } else {
      setSelectedColors(prev => [...prev, index].sort((a, b) => a - b));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gradient Generator</CardTitle>
        <CardDescription>
          Create beautiful gradients from your palette colors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gradient Preview */}
        <div
          className="w-full h-48 rounded-lg border shadow-inner"
          style={{ background: gradient }}
        />

        {/* Color Selection */}
        <div className="space-y-2">
          <Label>Select Colors</Label>
          <div className="flex gap-2 flex-wrap">
            {palette.map((color, index) => (
              <button
                key={color.id}
                onClick={() => toggleColorSelection(index)}
                className={`relative w-16 h-16 rounded-lg border-2 transition-all ${
                  selectedColors.includes(index)
                    ? 'border-primary scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.hex}
              >
                {selectedColors.includes(index) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge className="text-xs">
                      {selectedColors.indexOf(index) + 1}
                    </Badge>
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Click colors to add/remove from gradient. Minimum 2 colors required.
          </p>
        </div>

        {/* Gradient Type */}
        <div className="space-y-2">
          <Label>Gradient Type</Label>
          <div className="flex gap-2">
            <Button
              variant={gradientType === 'linear' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGradientType('linear')}
            >
              Linear
            </Button>
            <Button
              variant={gradientType === 'radial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGradientType('radial')}
            >
              Radial
            </Button>
          </div>
        </div>

        {/* Direction (Linear only) */}
        {gradientType === 'linear' && (
          <div className="space-y-2">
            <Label>Direction</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['to right', 'to left', 'to bottom', 'to top', 'to bottom right', 'to bottom left'] as GradientDirection[]).map(dir => (
                <Button
                  key={dir}
                  variant={direction === dir ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDirection(dir)}
                  className="text-xs"
                >
                  {dir}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Color Steps */}
        {selectedColors.length === 2 && (
          <div className="space-y-2">
            <Label>Color Steps: {steps}</Label>
            <input
              type="range"
              min="2"
              max="10"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex gap-1 h-8">
              {intermediateColors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 rounded"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* CSS Code */}
        <div className="space-y-2">
          <Label>CSS Code</Label>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            {cssCode}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleCopy} className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy CSS
              </>
            )}
          </Button>
          <Button onClick={handleDownloadSVG} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
