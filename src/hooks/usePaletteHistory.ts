import { useState, useCallback } from 'react';
import type { PaletteColor } from '@/utils/colorTheory';

interface HistoryState {
  palette: PaletteColor[];
  timestamp: number;
}

export function usePaletteHistory(maxHistory: number = 50) {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((palette: PaletteColor[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ palette: JSON.parse(JSON.stringify(palette)), timestamp: Date.now() });

      if (newHistory.length > maxHistory) {
        newHistory.shift();
        return newHistory;
      }

      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].palette;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].palette;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    history,
    currentIndex,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
  };
}
