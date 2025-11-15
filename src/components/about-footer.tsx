import { Palette } from 'lucide-react';

export function AboutFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Palette className="h-4 w-4" />
              <span>
                © {currentYear} Color Palette Generator. All rights reserved.
              </span>
            </div>

            <div className="text-sm">
              <p className="text-muted-foreground">
                Powered by{' '}
                <a
                  href="https://www.scalinghigh.com"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Scaling High Technologies
                </a>
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Need SEO, Web Development, or Graphic Design?{' '}
                <a
                  href="https://www.scalinghigh.com/contact"
                  className="text-foreground hover:text-primary transition-colors font-medium underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Get in touch
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6 text-xs text-muted-foreground text-center">
            <p>
              <strong>Keywords:</strong> color palette generator, color scheme generator, color combination tool,
              hex color picker, palette creator, color harmony, complementary colors, analogous colors,
              color wheel, WCAG accessibility, contrast checker, color theory, web design colors,
              UI color palette, brand colors, color extractor, image to palette, CSS color generator
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
