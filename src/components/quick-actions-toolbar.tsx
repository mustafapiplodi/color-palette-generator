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
      <div className="flex items-center gap-2 justify-center">
        {/* History Actions */}
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

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-1" />
              More Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Lock Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onLockAll} disabled={allLocked}>
              <Lock className="h-4 w-4 mr-2" />
              Lock All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onUnlockAll} disabled={!hasLockedColors}>
              <LockOpen className="h-4 w-4 mr-2" />
              Unlock All
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Generation</DropdownMenuLabel>
            <DropdownMenuItem onClick={onRandomizeSingle}>
              <Palette className="h-4 w-4 mr-2" />
              Randomize One Color
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Palette
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onInvertColors}>
              <Blend className="h-4 w-4 mr-2" />
              Invert Colors
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Adjustments</DropdownMenuLabel>
            <DropdownMenuItem onClick={onLighten}>
              <Sun className="h-4 w-4 mr-2" />
              Lighten (+10%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDarken}>
              <Moon className="h-4 w-4 mr-2" />
              Darken (-10%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSaturate}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Increase Saturation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDesaturate}>
              <TrendingDown className="h-4 w-4 mr-2" />
              Decrease Saturation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
