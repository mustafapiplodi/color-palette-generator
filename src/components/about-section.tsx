import { Palette } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="py-16 border-t" id="about">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Palette className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">
              About Our Color Palette Generator
            </h2>
          </div>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Welcome to the most comprehensive <strong>free color palette generator</strong> online.
              Our tool combines classical color theory with modern web design needs to help designers,
              developers, and artists create beautiful, harmonious color schemes in seconds.
            </p>

            <p>
              Whether you're designing a website, creating a brand identity, developing a mobile app,
              or working on digital art, our <strong>color scheme generator</strong> provides everything
              you need. From basic HEX color codes to advanced WCAG accessibility checking, we've built
              a tool that grows with your expertise.
            </p>

            <h3 className="text-lg font-semibold text-foreground pt-4">
              Why Choose Our Color Palette Generator?
            </h3>

            <ul className="space-y-2 list-disc list-inside pl-2">
              <li>
                <strong>Based on Color Theory:</strong> Generate palettes using proven algorithms
                including monochromatic, analogous, complementary, triadic, and tetradic color harmonies.
              </li>
              <li>
                <strong>Image Color Extraction:</strong> Upload any photo to extract its dominant
                colors automatically using advanced k-means clustering algorithms.
              </li>
              <li>
                <strong>Accessibility First:</strong> Built-in WCAG 2.1 AA and AAA contrast checking
                ensures your color combinations are accessible to all users, including those with
                visual impairments.
              </li>
              <li>
                <strong>12 Export Formats:</strong> Export your palette in HEX, RGB, HSL, CSS variables,
                SCSS, Tailwind CSS, Material-UI, Android XML, iOS Swift, SVG, JSON, and Markdown.
              </li>
              <li>
                <strong>Real-Time Adjustments:</strong> Fine-tune individual colors with HSL sliders
                while seeing live previews and contrast ratios.
              </li>
              <li>
                <strong>Share & Collaborate:</strong> Generate shareable URLs and QR codes to
                collaborate with team members and clients effortlessly.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground pt-4">
              Perfect For:
            </h3>

            <ul className="space-y-2 list-disc list-inside pl-2">
              <li><strong>Web Designers:</strong> Create accessible, modern color schemes for websites and web applications</li>
              <li><strong>UI/UX Designers:</strong> Generate harmonious palettes that enhance user experience</li>
              <li><strong>Brand Designers:</strong> Develop cohesive brand color identities with our color theory tools</li>
              <li><strong>Developers:</strong> Export palettes directly to CSS, Tailwind, or your framework of choice</li>
              <li><strong>Digital Artists:</strong> Discover inspiring color combinations for illustrations and artwork</li>
              <li><strong>Students:</strong> Learn color theory principles while creating professional palettes</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground pt-4">
              How We Help You Create Better Designs
            </h3>

            <p>
              Color is one of the most powerful tools in design. The right palette can evoke emotions,
              establish brand identity, improve usability, and create visual hierarchy. Our generator
              takes the guesswork out of color selection by applying proven color theory principles
              while giving you complete creative control.
            </p>

            <p>
              We've combined the science of color harmony with practical features like accessibility
              checking, multiple export formats, and real-time adjustments. Whether you're a beginner
              learning about complementary colors or a professional designer fine-tuning brand guidelines,
              our tool adapts to your needs.
            </p>

            <h3 className="text-lg font-semibold text-foreground pt-4">
              Free, Fast, and Privacy-Focused
            </h3>

            <p>
              Our color palette generator is completely free with no registration required. We don't
              store your data, track your usage, or require you to create an account. Generate unlimited
              palettes, extract colors from unlimited images, and export in any format—all for free.
            </p>

            <p>
              Built with modern web technologies including React, TypeScript, and Chroma.js, our tool
              is lightning-fast and works perfectly on desktop, tablet, and mobile devices. We're
              committed to providing the best free color tools for the design and development community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
