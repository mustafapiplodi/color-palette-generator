import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Lock,
  LockOpen,
  Palette,
  Sun,
  Moon,
  Blend,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { PaletteColor } from '@/utils/colorTheory';

interface QuickActionsToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onLockAll: () => void;
  onUnlockAll: () => void;
  onRandomizeSingle: () => void;
  onInvertColors: () => void;
  onLighten: () => void;
  onDarken: () => void;
  onSaturate: () => void;
  onDesaturate: () => void;
  palette: PaletteColor[];
}

export function QuickActionsToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onLockAll,
  onUnlockAll,
  onRandomizeSingle,
  onInvertColors,
  onLighten,
  onDarken,
  onSaturate,
  onDesaturate,
  palette,
}: QuickActionsToolbarProps) {
  const hasLockedColors = palette.some(c => c.locked);
  const allLocked = palette.every(c => c.locked);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {/* History Actions */}
        <div className="flex gap-1 border-r pr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4 mr-1" />
            Redo
          </Button>
        </div>

        {/* Lock Actions */}
        <div className="flex gap-1 border-r pr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLockAll}
            disabled={allLocked}
            title="Lock all colors"
          >
            <Lock className="h-4 w-4 mr-1" />
            Lock All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onUnlockAll}
            disabled={!hasLockedColors}
            title="Unlock all colors"
          >
            <LockOpen className="h-4 w-4 mr-1" />
            Unlock All
          </Button>
        </div>

        {/* Generation Actions */}
        <div className="flex gap-1 border-r pr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRandomizeSingle}
            title="Randomize one unlocked color"
          >
            <Palette className="h-4 w-4 mr-1" />
            Randomize One
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            title="Reset palette (R)"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Transform Actions */}
        <div className="flex gap-1 border-r pr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLighten}
            title="Lighten all colors by 10%"
          >
            <Sun className="h-4 w-4 mr-1" />
            Lighten
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDarken}
            title="Darken all colors by 10%"
          >
            <Moon className="h-4 w-4 mr-1" />
            Darken
          </Button>
        </div>

        {/* Saturation Actions */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaturate}
            title="Increase saturation by 10%"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Saturate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDesaturate}
            title="Decrease saturation by 10%"
          >
            <TrendingDown className="h-4 w-4 mr-1" />
            Desaturate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onInvertColors}
            title="Invert all colors (I)"
          >
            <Blend className="h-4 w-4 mr-1" />
            Invert
          </Button>
        </div>
      </div>
    </Card>
  );
}
