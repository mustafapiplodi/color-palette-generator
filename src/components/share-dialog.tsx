import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Share2, Copy, Check, QrCode as QrIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { PaletteColor } from '@/utils/colorTheory';
import { encodePaletteToURL } from '@/utils/colorHelpers';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palette: PaletteColor[];
}

export function ShareDialog({ open, onOpenChange, palette }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Generate shareable URL
  const colors = palette.map(c => c.hex);
  const encoded = encodePaletteToURL(colors);
  const shareUrl = `${window.location.origin}${window.location.pathname}?colors=${encoded}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Color Palette',
          text: 'Check out this color palette!',
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Palette
          </DialogTitle>
          <DialogDescription>
            Share this color palette with others via URL or QR code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Shareable Link</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view and use this palette
            </p>
          </div>

          {/* Palette Preview */}
          <div className="space-y-2">
            <Label>Palette Preview</Label>
            <div className="grid grid-cols-5 gap-2 h-20">
              {palette.map((color) => (
                <div
                  key={color.id}
                  className="rounded border"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>QR Code</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQR(!showQR)}
              >
                <QrIcon className="h-4 w-4 mr-1" />
                {showQR ? 'Hide' : 'Show'} QR Code
              </Button>
            </div>
            {showQR && (
              <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg">
                <QRCodeSVG value={shareUrl} size={200} level="M" />
                <p className="text-xs text-muted-foreground text-center">
                  Scan this QR code to open the palette on another device
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share via...
              </Button>
            )}
            <Button onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
