import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookTemplate, Check } from 'lucide-react';
import { PRESET_PALETTES, getCategorizedPresets, type PresetPalette } from '@/data/presets';

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (colors: string[]) => void;
}

export function TemplatesDialog({ open, onOpenChange, onSelectTemplate }: TemplatesDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categorizedPresets = getCategorizedPresets();

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'material', label: 'Material Design' },
    { value: 'brand', label: 'Brand Colors' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'mood', label: 'Moods' },
  ];

  const filteredPresets = selectedCategory === 'all'
    ? PRESET_PALETTES
    : categorizedPresets[selectedCategory as keyof typeof categorizedPresets] || [];

  const handleSelectPreset = (preset: PresetPalette) => {
    onSelectTemplate(preset.colors);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <div className="flex items-center gap-2">
            <BookTemplate className="h-6 w-6" />
            <DialogTitle>Color Templates & Presets</DialogTitle>
          </div>
          <DialogDescription>
            Choose from pre-made palettes inspired by popular design systems, seasons, and moods
          </DialogDescription>
        </DialogHeader>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {categories.map(category => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredPresets.map((preset, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all group"
              onClick={() => handleSelectPreset(preset)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{preset.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {preset.description}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {preset.category}
                </Badge>
              </div>

              {/* Color Swatches */}
              <div className="grid grid-cols-5 gap-2 h-16 mb-3">
                {preset.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="rounded border group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Apply Button */}
              <Button
                size="sm"
                className="w-full gap-2"
                variant="outline"
              >
                <Check className="h-3 w-3" />
                Use This Palette
              </Button>
            </div>
          ))}
        </div>

        {filteredPresets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No templates found in this category
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
