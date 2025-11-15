import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li className="flex items-center">
          <a
            href="https://www.scalinghigh.com"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            rel="noopener noreferrer"
          >
            <Home className="h-4 w-4" />
            Home
          </a>
        </li>
        <li>
          <ChevronRight className="h-4 w-4" />
        </li>
        <li className="text-foreground font-medium" aria-current="page">
          Color Palette Generator
        </li>
      </ol>
    </nav>
  );
}
