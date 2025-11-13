# Color Palette Generator

A modern web-based color palette generator built with React, TypeScript, and shadcn/ui. Create harmonious 5-color schemes using classical color theory algorithms, image extraction, and WCAG accessibility checking.

## Features

### Core Functionality
- **Color Theory Algorithms**: Generate palettes using monochromatic, analogous, complementary, triadic, and tetradic harmony models
- **Lock/Unlock Colors**: Pin favorite colors and regenerate only unlocked ones
- **Fine Adjustments**: Real-time HSL (Hue, Saturation, Lightness) sliders for precise color control
- **Image Extraction**: Upload images to extract dominant colors using Color Thief's k-means clustering
- **Dark Mode**: Built-in theme toggle with system preference detection

### Export Options
- HEX list
- RGB values
- HSL values
- CSS custom properties (`:root` variables)
- SCSS variables and maps
- JSON format

### Accessibility
- **WCAG Contrast Checker**: Real-time contrast ratio calculation with AA/AAA compliance indicators
- **Color-blind Safe**: Designed with accessibility-first approach
- **Keyboard Navigation**: Press `Space` to generate new palettes

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Fast build tooling
- **Tailwind CSS v3** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible UI components
- **Chroma.js** - Color manipulation and conversion
- **Color Thief** - Image palette extraction
- **Lucide React** - Icon library
- **next-themes** - Dark mode implementation

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Generate Palettes
1. **Select Harmony Type**: Choose from monochromatic, analogous, complementary, triadic, or tetradic
2. **Generate**: Click "Generate Palette" or press `Space` to create a new palette
3. **Lock Colors**: Click the lock icon on any color to keep it during regeneration
4. **Adjust Colors**: Click on a color card to reveal HSL adjustment sliders

### Extract from Images
1. Click or drag-and-drop an image into the upload area
2. The palette will automatically update with the 5 most dominant colors
3. Further adjust colors using harmony types or manual HSL sliders

### Export Palettes
1. Select your preferred export format (HEX, RGB, HSL, CSS, SCSS, or JSON)
2. **Copy to Clipboard**: Click to copy the formatted palette
3. **Download**: Save as a file for use in your projects

### Check Accessibility
- Each color card shows contrast ratio against the primary color
- Green check (✓) indicates WCAG AA/AAA compliance
- Yellow warning indicates potential accessibility issues

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── slider.tsx
│   ├── image-upload.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── utils/
│   ├── colorTheory.ts   # Color harmony algorithms
│   └── exportFormats.ts # Export utilities
├── lib/
│   └── utils.ts         # Helper functions
├── types/
│   └── colorthief.d.ts  # Type definitions
├── App.tsx              # Main application
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Color Theory Algorithms

### Monochromatic
Variations of a single hue with different tints, shades, and tones.

### Analogous
Adjacent colors on the color wheel (±30°), creating gentle contrast.

### Complementary
Opposite colors on the wheel (180° apart), providing high contrast.

### Triadic
Three colors evenly spaced 120° apart, creating balanced, vibrant palettes.

### Tetradic
Two complementary pairs forming a rectangle on the color wheel.

## Development Roadmap

### ✅ Phase 1: MVP (Complete)
- Color theory algorithms
- Basic UI with generate and lock functionality
- Export in multiple formats
- Image-based extraction

### ✅ Phase 2: Enhanced Features (Complete)
- HSL adjustment sliders
- WCAG contrast checker
- Dark mode support
- Keyboard shortcuts
- Mobile responsive design

### 🔄 Phase 3: Future Enhancements
- Color-blind simulation modes
- User accounts and saved palettes
- Community gallery
- AI-driven palette suggestions
- Real-time UI mockup previews
- PWA support for offline use

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Chroma.js](https://gka.github.io/chroma.js/) - Color manipulation
- [Color Thief](https://github.com/lokesh/color-thief) - Image palette extraction
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Resources

- [Implementation Guide](./Claude.MD) - Comprehensive project documentation
- [Color Theory Basics](https://www.interaction-design.org/literature/article/the-basics-of-color-theory)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

Built with ❤️ using React, TypeScript, and shadcn/ui
