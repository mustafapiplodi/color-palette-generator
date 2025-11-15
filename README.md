# 🎨 Color Palette Generator

A professional, feature-rich color palette generator built with React, TypeScript, and modern web technologies. Create harmonious color schemes using proven color theory algorithms, extract colors from images, and ensure WCAG accessibility compliance.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://www.scalinghigh.com/color-palette-generator)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff.svg)](https://vitejs.dev/)

## ✨ Features

### 🎯 Core Functionality
- **5 Color Harmony Algorithms**: Monochromatic, Analogous, Complementary, Triadic, and Tetradic
- **Image Color Extraction**: Upload images to extract dominant colors using advanced k-means clustering
- **Real-Time Color Adjustment**: Fine-tune hue, saturation, and lightness with live preview
- **Lock/Unlock Colors**: Preserve specific colors while regenerating others
- **Undo/Redo System**: Full history with 50-state memory (preserves harmony types)
- **Dark Mode**: Built-in theme toggle with system preference detection

### ♿ Accessibility First
- **WCAG Compliance Checker**: Built-in AA/AAA contrast ratio validation
- **Accessibility Score**: Comprehensive palette accessibility metrics
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Color Independence**: Icons and text labels for all interactive elements

### 📤 Export Options (12 Formats)
- **Web**: HEX, RGB, HSL, CSS Custom Properties, SCSS Maps/Variables
- **Frameworks**: Tailwind CSS, Material-UI Theme
- **Mobile**: Android XML, iOS Swift
- **Other**: JSON, SVG, Markdown

### 🚀 Advanced Features
- **Palette Metrics**: Accessibility, Harmony, and Uniqueness scores
- **Gradient Generator**: Create CSS gradients from palette colors
- **Color Wheel Visualization**: See color relationships on the wheel
- **UI Mockup Preview**: Preview colors on real UI elements
- **Share Palettes**: Generate shareable URLs and QR codes
- **Template Library**: Pre-built professional palettes

### ⌨️ Keyboard Shortcuts
- `Space` - Generate new palette
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `R` - Reset palette
- `I` - Invert colors
- `1-5` - Select color cards
- `?` - Show all shortcuts

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **shadcn/ui** - Component library
- **Framer Motion 12** - Animations

### Color Libraries
- **Chroma.js 3.1** - Color manipulation and conversion
- **ColorThief 2.6** - Image color extraction
- **color-namer 1.4** - Color name identification

### Additional Tools
- **Driver.js** - Onboarding tours
- **QRCode.react** - QR code generation
- **Sonner** - Toast notifications
- **next-themes** - Dark mode support
- **Lucide React** - Icon library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mustafapiplodi/color-palette-generator.git
cd color-palette-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
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

## 💼 About

Developed by [Scaling High Technologies](https://www.scalinghigh.com)

Need SEO, Web Development, or Graphic Design? [Get in touch](https://www.scalinghigh.com/contact)

## 🔗 Links

- **Live Demo**: [Color Palette Generator](https://www.scalinghigh.com/color-palette-generator)
- **Issues**: [GitHub Issues](https://github.com/mustafapiplodi/color-palette-generator/issues)
- **Company**: [ScalingHigh.com](https://www.scalinghigh.com)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Scaling High Technologies](https://www.scalinghigh.com)

</div>
