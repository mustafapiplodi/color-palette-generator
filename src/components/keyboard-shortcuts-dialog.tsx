import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { keys: ['Space'], description: 'Generate new palette' },
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Y'], description: 'Redo' },
  { keys: ['Ctrl', 'Shift', 'Y'], description: 'Redo (alternative)' },
  { keys: ['1'], description: 'Select first color' },
  { keys: ['2'], description: 'Select second color' },
  { keys: ['3'], description: 'Select third color' },
  { keys: ['4'], description: 'Select fourth color' },
  { keys: ['5'], description: 'Select fifth color' },
  { keys: ['L'], description: 'Toggle lock on selected color' },
  { keys: ['C'], description: 'Copy selected color' },
  { keys: ['I'], description: 'Invert all colors' },
  { keys: ['R'], description: 'Reset palette' },
  { keys: ['?'], description: 'Show this help' },
  { keys: ['Esc'], description: 'Close dialogs' },
];

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-6 w-6" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and control the color palette generator
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-semibold bg-muted rounded border border-border"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-2">Tip:</p>
          <p>Press <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">?</kbd> at any time to show this dialog</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
