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
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {/* Primary Actions - Always Visible with keyboard hints */}
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="gap-2 h-9"
        >
          <Undo2 className="h-4 w-4" />
          Undo
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-muted rounded text-xs">
            ⌘Z
          </kbd>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="gap-2 h-9"
        >
          <Redo2 className="h-4 w-4" />
          Redo
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-muted rounded text-xs">
            ⌘Y
          </kbd>
        </Button>

        <div className="h-6 w-px bg-border mx-1" /> {/* Separator */}

        <Button
          variant="outline"
          size="sm"
          onClick={allLocked ? onUnlockAll : onLockAll}
          className="gap-2 h-9"
          title={allLocked ? "Unlock all colors" : "Lock all colors"}
        >
          {allLocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {allLocked ? 'Unlock All' : 'Lock All'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRandomizeSingle}
          className="gap-2 h-9"
          title="Randomize one unlocked color"
        >
          <Palette className="h-4 w-4" />
          Randomize
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onInvertColors}
          className="gap-2 h-9"
        >
          <Blend className="h-4 w-4" />
          Invert
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-muted rounded text-xs">
            I
          </kbd>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2 h-9"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 bg-muted rounded text-xs">
            R
          </kbd>
        </Button>

        {/* Additional Actions in Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <MoreHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Color Adjustments</DropdownMenuLabel>
            <DropdownMenuItem onClick={onLighten}>
              <Sun className="h-4 w-4 mr-2" />
              Lighten All Colors (+10%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDarken}>
              <Moon className="h-4 w-4 mr-2" />
              Darken All Colors (-10%)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSaturate}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Increase Saturation (+10%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDesaturate}>
              <TrendingDown className="h-4 w-4 mr-2" />
              Decrease Saturation (-10%)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
