import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';
import type { HarmonyType } from '@/utils/colorTheory';
import { generatePalette } from '@/utils/colorTheory';

interface HarmonySelectorProps {
  value: HarmonyType;
  onChange: (type: HarmonyType) => void;
  baseColor?: string;
}

const HARMONY_TYPES: {
  value: HarmonyType;
  label: string;
  description: string;
  icon: string;
}[] = [
  { value: 'monochromatic', label: 'Monochromatic', description: 'Single hue variations', icon: '⚫' },
  { value: 'analogous', label: 'Analogous', description: 'Adjacent colors (±30°)', icon: '🎨' },
  { value: 'complementary', label: 'Complementary', description: 'Opposite (180°)', icon: '⚖️' },
  { value: 'triadic', label: 'Triadic', description: '120° spacing', icon: '🔺' },
  { value: 'tetradic', label: 'Tetradic', description: 'Two pairs', icon: '🔲' },
];

export function HarmonySelector({ value, onChange, baseColor = '#3b82f6' }: HarmonySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Color Harmony</h3>
        <Badge variant="outline" className="text-xs">
          {HARMONY_TYPES.find(t => t.value === value)?.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {HARMONY_TYPES.map((type) => {
          const isSelected = value === type.value;
          const previewColors = generatePalette(baseColor, type.value).slice(0, 5);

          return (
            <button
              key={type.value}
              onClick={() => onChange(type.value)}
              className={`relative group transition-all ${
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'hover:ring-2 hover:ring-muted ring-offset-2 ring-offset-background'
              }`}
            >
              <Card className={`p-3 cursor-pointer transition-all ${
                isSelected ? 'shadow-md' : 'hover:shadow-sm'
              }`}>
                {/* Color Preview */}
                <div className="flex gap-1 mb-2 h-8">
                  {previewColors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Label */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-medium text-xs flex items-center gap-1">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {type.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
