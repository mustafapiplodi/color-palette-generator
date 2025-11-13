import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import ColorThief from 'colorthief';

interface ImageUploadProps {
  onColorsExtracted: (colors: string[]) => void;
}

export function ImageUpload({ onColorsExtracted }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const extractColors = (imgElement: HTMLImageElement) => {
    try {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(imgElement, 5);

      if (palette) {
        const hexColors = palette.map(
          (rgb: number[]) => `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`
        );
        onColorsExtracted(hexColors);
      }
    } catch (error) {
      console.error('Failed to extract colors:', error);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);

        // Extract colors after image loads
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          extractColors(img);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Upload an image to extract colors
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop or click to browse
            </p>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                ref={imageRef}
                src={image}
                alt="Uploaded"
                className="w-full h-48 object-cover rounded-lg"
                crossOrigin="anonymous"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Colors extracted successfully! The palette above has been updated.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
