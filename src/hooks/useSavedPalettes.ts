import { useLocalStorage } from './useLocalStorage';
import type { PaletteColor } from '../utils/colorTheory';

export interface SavedPalette {
  id: string;
  colors: string[]; // Array of hex colors
  name: string;
  createdAt: number;
  favorite?: boolean;
}

export function useSavedPalettes() {
  const [savedPalettes, setSavedPalettes] = useLocalStorage<SavedPalette[]>('savedPalettes', []);

  const savePalette = (palette: PaletteColor[], name?: string) => {
    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      colors: palette.map(c => c.hex),
      name: name || `Palette ${new Date().toLocaleDateString()}`,
      createdAt: Date.now(),
      favorite: false,
    };

    setSavedPalettes([newPalette, ...savedPalettes].slice(0, 50)); // Keep last 50
    return newPalette;
  };

  const deletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter(p => p.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setSavedPalettes(
      savedPalettes.map(p =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      )
    );
  };

  const renamePalette = (id: string, name: string) => {
    setSavedPalettes(
      savedPalettes.map(p =>
        p.id === id ? { ...p, name } : p
      )
    );
  };

  const clearAll = () => {
    setSavedPalettes([]);
  };

  return {
    savedPalettes,
    savePalette,
    deletePalette,
    toggleFavorite,
    renamePalette,
    clearAll,
  };
}
