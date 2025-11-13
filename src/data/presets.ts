export interface PresetPalette {
  name: string;
  category: 'material' | 'brand' | 'seasonal' | 'cultural' | 'mood';
  colors: string[];
  description: string;
}

export const PRESET_PALETTES: PresetPalette[] = [
  // Material Design
  {
    name: 'Material Red',
    category: 'material',
    colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'],
    description: 'Material Design red palette',
  },
  {
    name: 'Material Blue',
    category: 'material',
    colors: ['#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'],
    description: 'Material Design blue-green palette',
  },
  {
    name: 'Material Indigo',
    category: 'material',
    colors: ['#3F51B5', '#5C6BC0', '#7986CB', '#9FA8DA', '#C5CAE9'],
    description: 'Material Design indigo shades',
  },

  // Brand Colors
  {
    name: 'Ant Design',
    category: 'brand',
    colors: ['#1890FF', '#52C41A', '#FAAD14', '#F5222D', '#722ED1'],
    description: 'Ant Design system colors',
  },
  {
    name: 'Tailwind',
    category: 'brand',
    colors: ['#06B6D4', '#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899'],
    description: 'Tailwind CSS primary colors',
  },
  {
    name: 'Bootstrap',
    category: 'brand',
    colors: ['#0D6EFD', '#6C757D', '#28A745', '#FFC107', '#DC3545'],
    description: 'Bootstrap theme colors',
  },

  // Seasonal
  {
    name: 'Spring Bloom',
    category: 'seasonal',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    description: 'Fresh spring pastel colors',
  },
  {
    name: 'Summer Sunset',
    category: 'seasonal',
    colors: ['#FF6B6B', '#FFA500', '#FFD93D', '#6BCF7F', '#4ECDC4'],
    description: 'Warm summer evening colors',
  },
  {
    name: 'Autumn Harvest',
    category: 'seasonal',
    colors: ['#D4A574', '#C17532', '#8B4513', '#CD853F', '#DAA520'],
    description: 'Warm autumn earth tones',
  },
  {
    name: 'Winter Frost',
    category: 'seasonal',
    colors: ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA'],
    description: 'Cool winter ice colors',
  },

  // Cultural
  {
    name: 'Japanese Zen',
    category: 'cultural',
    colors: ['#8B7355', '#E0C097', '#F5E6D3', '#A8C69F', '#6A8F7D'],
    description: 'Minimalist Japanese aesthetic',
  },
  {
    name: 'Scandinavian',
    category: 'cultural',
    colors: ['#F0F3F4', '#D5DBDB', '#85929E', '#566573', '#2C3E50'],
    description: 'Nordic minimalist palette',
  },
  {
    name: 'Mediterranean',
    category: 'cultural',
    colors: ['#0077B6', '#00B4D8', '#90E0EF', '#E3E3E3', '#F4A261'],
    description: 'Mediterranean sea and sun',
  },

  // Moods
  {
    name: 'Energetic',
    category: 'mood',
    colors: ['#FF0080', '#FF8C00', '#FFD700', '#00FF7F', '#00CED1'],
    description: 'High energy vibrant colors',
  },
  {
    name: 'Calm & Professional',
    category: 'mood',
    colors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'],
    description: 'Professional business palette',
  },
  {
    name: 'Romantic',
    category: 'mood',
    colors: ['#FF69B4', '#FFC0CB', '#FFB6C1', '#DDA0DD', '#EE82EE'],
    description: 'Soft romantic pinks and purples',
  },
  {
    name: 'Nature',
    category: 'mood',
    colors: ['#228B22', '#32CD32', '#90EE90', '#8B4513', '#A0522D'],
    description: 'Natural greens and earth tones',
  },
  {
    name: 'Tech & Modern',
    category: 'mood',
    colors: ['#00F5FF', '#1E90FF', '#9370DB', '#FF1493', '#00FF00'],
    description: 'Futuristic neon palette',
  },
  {
    name: 'Vintage',
    category: 'mood',
    colors: ['#D4A574', '#C9A186', '#B5866E', '#A97155', '#8B6C5C'],
    description: 'Nostalgic vintage tones',
  },
];

export const getCategorizedPresets = () => {
  const categories: Record<string, PresetPalette[]> = {
    material: [],
    brand: [],
    seasonal: [],
    cultural: [],
    mood: [],
  };

  PRESET_PALETTES.forEach(preset => {
    categories[preset.category].push(preset);
  });

  return categories;
};
