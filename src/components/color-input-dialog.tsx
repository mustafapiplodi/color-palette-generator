import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Pipette } from 'lucide-react';
import { parseColorInput } from '@/utils/colorHelpers';
import { HexColorPicker } from 'react-colorful';

interface ColorInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onColorSelected: (color: string) => void;
}

export function ColorInputDialog({ open, onOpenChange, onColorSelected }: ColorInputDialogProps) {
  const [color, setColor] = useState('#3b82f6');
  const [inputValue, setInputValue] = useState('#3b82f6');
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setError('');

    const parsed = parseColorInput(value);
    if (parsed) {
      setColor(parsed);
      setError('');
    } else if (value.trim()) {
      setError('Invalid color format');
    }
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        setColor(result.sRGBHex);
        setInputValue(result.sRGBHex);
        setError('');
      } catch (err) {
        console.log('Eye dropper cancelled or failed');
      }
    } else {
      setError('Eye dropper not supported in this browser');
    }
  };

  const handleApply = () => {
    if (color) {
      onColorSelected(color);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Pick a Color</DialogTitle>
          <DialogDescription>
            Choose a base color using the picker, enter a color code, or use the eye dropper
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Color Picker */}
          <div className="flex justify-center">
            <HexColorPicker color={color} onChange={(c) => { setColor(c); setInputValue(c); }} />
          </div>

          {/* Color Input */}
          <div className="space-y-2">
            <Label htmlFor="color-input">Color Code</Label>
            <div className="flex gap-2">
              <Input
                id="color-input"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="#3b82f6 or rgb(59, 130, 246)"
                className={error ? 'border-destructive' : ''}
              />
              {'EyeDropper' in window && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEyeDropper}
                  title="Pick color from screen"
                >
                  <Pipette className="h-4 w-4" />
                </Button>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Supports HEX (#3b82f6), RGB (rgb(59, 130, 246)), HSL (hsl(217, 91%, 60%))
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div
              className="w-full h-20 rounded-lg border"
              style={{ backgroundColor: color }}
            />
            <p className="text-sm font-mono text-center">{color}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Color
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
