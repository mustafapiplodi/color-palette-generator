import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { EnhancedColorCard } from './enhanced-color-card';
import type { PaletteColor } from '@/utils/colorTheory';

interface ColorCarouselProps {
  palette: PaletteColor[];
  selectedColorId: string | null;
  copiedIndex: number | null;
  onSelect: (id: string) => void;
  onToggleLock: (id: string) => void;
  onCopy: (hex: string, index: number) => void;
  onAdjust: (id: string, type: 'h' | 's' | 'l', value: number) => void;
}

export function ColorCarousel({
  palette,
  selectedColorId,
  copiedIndex,
  onSelect,
  onToggleLock,
  onCopy,
  onAdjust,
}: ColorCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < palette.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToNext = () => {
    if (currentIndex < palette.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative md:hidden">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{
            x: `-${currentIndex * 100}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          {palette.map((color, index) => (
            <div key={color.id} className="w-full flex-shrink-0 px-2">
              <EnhancedColorCard
                color={color}
                index={index}
                isSelected={selectedColorId === color.id}
                copiedIndex={copiedIndex}
                onSelect={() => onSelect(color.id)}
                onToggleLock={() => onToggleLock(color.id)}
                onCopy={() => onCopy(color.hex, index)}
                onAdjust={(type, value) => onAdjust(color.id, type, value)}
                contrastWith={palette[0]?.hex}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg z-10"
        onClick={goToPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg z-10"
        onClick={goToNext}
        disabled={currentIndex === palette.length - 1}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {palette.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30'
            }`}
            aria-label={`Go to color ${index + 1}`}
          />
        ))}
      </div>

      {/* Color Counter */}
      <div className="text-center mt-2 text-sm text-muted-foreground">
        {currentIndex + 1} / {palette.length}
      </div>
    </div>
  );
}
