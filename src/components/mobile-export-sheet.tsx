import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import type { PaletteColor } from '@/utils/colorTheory';
import type { ExportFormat } from '@/utils/exportFormats';
import { exportPalette } from '@/utils/exportFormats';

interface MobileExportSheetProps {
  palette: PaletteColor[];
  exportFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onDownload: () => void;
  onCopy: () => void;
}

const QUICK_FORMATS: { value: ExportFormat; label: string; icon: string }[] = [
  { value: 'hex', label: 'HEX', icon: '#' },
  { value: 'rgb', label: 'RGB', icon: 'R' },
  { value: 'hsl', label: 'HSL', icon: 'H' },
  { value: 'css', label: 'CSS', icon: '{' },
  { value: 'tailwind', label: 'Tailwind', icon: 'T' },
  { value: 'json', label: 'JSON', icon: '[]' },
];

export function MobileExportSheet({
  palette,
  exportFormat,
  onFormatChange,
  onDownload,
  onCopy,
}: MobileExportSheetProps) {
  const [open, setOpen] = useState(false);
  const previewText = exportPalette(palette, exportFormat);

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
        aria-label="Export palette"
      >
        <Share2 className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full sm:max-w-md">
          <DialogClose onClose={() => setOpen(false)} />
          <DialogHeader>
            <DialogTitle>Export Palette</DialogTitle>
            <DialogDescription>
              Choose a format and export your color palette
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Format Selection */}
            <div>
              <label className="text-sm font-medium block mb-2">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_FORMATS.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => onFormatChange(format.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      exportFormat === format.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{format.icon}</div>
                    <div className="text-xs font-medium">{format.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="text-sm font-medium block mb-2">Preview</label>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-48 overflow-y-auto border">
                <code>{previewText}</code>
              </pre>
            </div>

            {/* Color Swatches */}
            <div>
              <label className="text-sm font-medium block mb-2">Colors</label>
              <div className="flex gap-2">
                {palette.map((color, i) => (
                  <div key={i} className="flex-1">
                    <div
                      className="h-12 rounded-md border-2 border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="text-[10px] text-center mt-1 text-muted-foreground">
                      {color.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={() => { onCopy(); setOpen(false); }} className="flex-1 gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={() => { onDownload(); setOpen(false); }} variant="outline" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
