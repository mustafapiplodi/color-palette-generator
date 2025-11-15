import { Card, CardContent } from './ui/card';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'What is a color palette generator?',
    answer: 'A color palette generator is a tool that creates harmonious sets of colors based on color theory principles. Our generator uses algorithms like complementary, analogous, triadic, and tetradic to produce professional color schemes for web design, graphic design, branding, and UI/UX projects.',
  },
  {
    question: 'How do I generate a color palette?',
    answer: 'Simply click the "Generate Palette" button or press the spacebar to create a new random color palette. You can also choose a specific harmony type (monochromatic, analogous, complementary, triadic, or tetradic), upload an image to extract colors, or pick a custom base color to build your palette around.',
  },
  {
    question: 'What color harmony types are available?',
    answer: 'We offer five color harmony algorithms: Monochromatic (variations of one color), Analogous (adjacent colors on the wheel), Complementary (opposite colors), Triadic (three evenly-spaced colors), and Tetradic (two complementary pairs). Each creates visually balanced and professional color combinations.',
  },
  {
    question: 'Can I extract colors from an image?',
    answer: 'Yes! Our image color extraction feature uses advanced algorithms to identify the dominant colors in any photo. Simply drag and drop an image or click to upload, and we\'ll extract 5 unique, representative colors from it. This is perfect for creating brand palettes from logos or matching existing designs.',
  },
  {
    question: 'How do I check if my colors are accessible?',
    answer: 'Our built-in WCAG accessibility checker automatically calculates contrast ratios between your colors. Look for the AA and AAA badges on each color card, or check the Palette Metrics in the Advanced tab for a comprehensive accessibility score. We ensure your designs meet web accessibility standards.',
  },
  {
    question: 'What export formats are supported?',
    answer: 'We support 12 different export formats: HEX, RGB, HSL, CSS (custom properties), SCSS (maps and variables), JSON, Tailwind CSS, Material-UI themes, Android XML, iOS Swift, SVG, and Markdown. You can copy to clipboard or download as a file for any format.',
  },
  {
    question: 'How do I lock colors in my palette?',
    answer: 'Click the lock icon on any color card to preserve that color when generating new palettes. Locked colors stay in place while unlocked colors regenerate, allowing you to build your perfect palette iteratively. You can lock/unlock individual colors or use "Lock All" and "Unlock All" in the Quick Actions toolbar.',
  },
  {
    question: 'Can I share my color palette with others?',
    answer: 'Absolutely! Click the "Share Palette" button to generate a unique shareable URL. Anyone with the link can view and use your palette. You can also generate a QR code for easy mobile sharing, or use the native share functionality on mobile devices.',
  },
  {
    question: 'What is the difference between HEX, RGB, and HSL?',
    answer: 'HEX is a hexadecimal code (e.g., #FF5733) commonly used in web design. RGB represents colors using Red, Green, and Blue values (0-255). HSL uses Hue (color), Saturation (intensity), and Lightness (brightness), making it more intuitive for color adjustments. Our tool provides all three formats for maximum compatibility.',
  },
  {
    question: 'Are there keyboard shortcuts available?',
    answer: 'Yes! Press Spacebar to generate a new palette, Ctrl+Z to undo, Ctrl+Y to redo, R to reset, I to invert colors, and ? to see all shortcuts. You can also press 1-5 to select individual color cards. Keyboard shortcuts make color palette creation incredibly fast and efficient.',
  },
  {
    question: 'Is the color palette generator free to use?',
    answer: 'Yes, our color palette generator is completely free to use with no registration required. You can generate unlimited palettes, extract colors from images, export in any format, and access all features including accessibility checking, gradient generation, and palette analytics at no cost.',
  },
  {
    question: 'Does it work on mobile devices?',
    answer: 'Yes! The color palette generator is fully responsive and optimized for mobile, tablet, and desktop devices. We include touch-friendly controls, a mobile export sheet, and responsive layouts that work perfectly on any screen size. Create color palettes on the go from your smartphone or tablet.',
  },
  {
    question: 'How accurate is the WCAG contrast checker?',
    answer: 'Our contrast checker follows the official WCAG 2.1 guidelines precisely. It calculates the exact contrast ratio between color pairs and indicates whether they pass AA (4.5:1 minimum) or AAA (7:1 minimum) standards for normal text. This ensures your color choices meet international accessibility standards.',
  },
  {
    question: 'Can I use generated palettes for commercial projects?',
    answer: 'Yes, all color palettes generated by our tool are free to use in both personal and commercial projects without any attribution required. Colors cannot be copyrighted, so you can use your palettes in websites, apps, branding, marketing materials, and any other projects.',
  },
  {
    question: 'What is the best color palette for a website?',
    answer: 'The best website color palette depends on your brand and audience. Generally, use a primary color for your brand identity, a complementary or analogous color for accents, neutral colors for backgrounds, and ensure sufficient contrast for readability. Our harmony algorithms help create balanced palettes, while the accessibility checker ensures they\'re usable for all visitors.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 border-t" id="faq">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about using our color palette generator,
            from basic color theory to advanced features and accessibility guidelines.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardContent className="p-0">
                <button
                  className="w-full text-left p-6 flex items-start justify-between gap-4"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="font-semibold text-base pr-8">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
