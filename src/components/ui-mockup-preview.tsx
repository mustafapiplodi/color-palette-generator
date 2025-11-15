import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

import type { PaletteColor } from '@/utils/colorTheory';
import { getOptimalTextColor } from '@/utils/colorHelpers';

interface UIMockupPreviewProps {
  palette: PaletteColor[];
}

export function UIMockupPreview({ palette }: UIMockupPreviewProps) {
  if (palette.length < 3) return null;

  const primary = palette.find(c => c.role === 'primary') || palette[0];
  const secondary = palette.find(c => c.role === 'secondary') || palette[1];
  const accent = palette.find(c => c.role === 'accent') || palette[2];
  const background = palette.find(c => c.role === 'background') || palette[3] || palette[0];
  const support = palette.find(c => c.role === 'support') || palette[4] || palette[1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>UI Preview</CardTitle>
        <CardDescription>
          See how your palette looks on real UI elements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Button Examples */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: primary.hex,
                color: getOptimalTextColor(primary.hex),
              }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: secondary.hex,
                color: getOptimalTextColor(secondary.hex),
              }}
            >
              Secondary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: accent.hex,
                color: getOptimalTextColor(accent.hex),
              }}
            >
              Accent Button
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium border-2 transition-all hover:opacity-90"
              style={{
                borderColor: primary.hex,
                color: primary.hex,
                backgroundColor: 'transparent',
              }}
            >
              Outline Button
            </button>
          </div>
        </div>

        {/* Card Example */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Card</h3>
          <div
            className="rounded-lg p-6 shadow-lg"
            style={{ backgroundColor: background.hex }}
          >
            <h4
              className="text-xl font-bold mb-2"
              style={{ color: primary.hex }}
            >
              Card Title
            </h4>
            <p
              className="text-sm mb-4"
              style={{ color: getOptimalTextColor(background.hex) }}
            >
              This is a sample card component showing how your text and colors work together.
              The background uses your background color.
            </p>
            <button
              className="px-4 py-2 rounded-lg font-medium text-sm"
              style={{
                backgroundColor: primary.hex,
                color: getOptimalTextColor(primary.hex),
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Badges & Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: primary.hex,
                color: getOptimalTextColor(primary.hex),
              }}
            >
              Primary
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: secondary.hex,
                color: getOptimalTextColor(secondary.hex),
              }}
            >
              Secondary
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: accent.hex,
                color: getOptimalTextColor(accent.hex),
              }}
            >
              Accent
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: support.hex,
                color: getOptimalTextColor(support.hex),
              }}
            >
              Support
            </span>
          </div>
        </div>

        {/* Text Hierarchy */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Typography</h3>
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: background.hex }}
          >
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: primary.hex }}
            >
              Main Heading
            </h1>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: secondary.hex }}
            >
              Subheading
            </h2>
            <p
              className="text-base mb-4"
              style={{ color: getOptimalTextColor(background.hex) }}
            >
              This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <a
              href="#"
              className="text-sm underline"
              style={{ color: accent.hex }}
            >
              This is a link
            </a>
          </div>
        </div>

        {/* Form Elements */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Form Elements</h3>
          <div className="space-y-3">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: primary.hex }}
              >
                Input Label
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-2 rounded-lg border-2"
                style={{
                  borderColor: secondary.hex,
                  backgroundColor: background.hex,
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 rounded"
                style={{ accentColor: primary.hex }}
              />
              <label className="text-sm">Checkbox example</label>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Navigation</h3>
          <div
            className="rounded-lg p-4 flex gap-6"
            style={{ backgroundColor: primary.hex }}
          >
            {['Home', 'About', 'Services', 'Contact'].map((item, i) => (
              <a
                key={i}
                href="#"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{ color: getOptimalTextColor(primary.hex) }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Alert/Message */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Alert Messages</h3>
          <div className="space-y-2">
            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: background.hex,
                borderLeftColor: accent.hex,
              }}
            >
              <p
                className="font-medium text-sm"
                style={{ color: accent.hex }}
              >
                Success!
              </p>
              <p
                className="text-sm"
                style={{ color: getOptimalTextColor(background.hex) }}
              >
                Your changes have been saved successfully.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
