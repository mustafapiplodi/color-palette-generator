import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Palette,
  Image,
  Download,
  Shuffle,
  Eye,
  Zap,
  Lock,
  Share2,
  Keyboard,
  Smartphone,
  Paintbrush,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Color Theory Algorithms',
    description: 'Generate harmonious palettes using proven color theory: monochromatic, analogous, complementary, triadic, and tetradic color schemes.',
  },
  {
    icon: Image,
    title: 'Image Color Extraction',
    description: 'Upload any image to extract its dominant colors automatically. Perfect for matching brand colors or creating palettes from photos.',
  },
  {
    icon: Eye,
    title: 'WCAG Accessibility Checker',
    description: 'Ensure your colors meet WCAG AA and AAA standards with built-in contrast ratio checking for accessible web design.',
  },
  {
    icon: Download,
    title: '12 Export Formats',
    description: 'Export palettes in HEX, RGB, HSL, CSS, SCSS, Tailwind, Material-UI, Android, iOS, SVG, JSON, and Markdown formats.',
  },
  {
    icon: Shuffle,
    title: 'Real-Time Color Adjustment',
    description: 'Fine-tune hue, saturation, and lightness with intuitive sliders. Lock colors you love and regenerate the rest.',
  },
  {
    icon: Lock,
    title: 'Lock & Unlock Colors',
    description: 'Lock individual colors to preserve them while generating new combinations. Create the perfect palette iteratively.',
  },
  {
    icon: Zap,
    title: 'Instant Preview & Copy',
    description: 'One-click copy in multiple formats (HEX, RGB, HSL). See your colors applied to real UI mockups instantly.',
  },
  {
    icon: Share2,
    title: 'Share Palettes via URL',
    description: 'Generate shareable links and QR codes for your color palettes. Collaborate with designers and developers seamlessly.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    description: 'Speed up your workflow with comprehensive keyboard shortcuts. Generate, undo, redo, and navigate without touching your mouse.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive Design',
    description: 'Works perfectly on desktop, tablet, and mobile devices. Create color palettes on the go with touch-optimized controls.',
  },
  {
    icon: Paintbrush,
    title: 'Gradient Generator',
    description: 'Create beautiful CSS gradients from your palette colors. Perfect for modern web design and backgrounds.',
  },
  {
    icon: BarChart3,
    title: 'Palette Analytics',
    description: 'Get detailed metrics on accessibility, harmony, uniqueness, temperature distribution, and brightness balance.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 border-t" id="features">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            Professional Color Palette Generator Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, customize, and export beautiful color schemes for web design,
            UI/UX projects, branding, and digital art. Generate accessible, harmonious palettes in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
