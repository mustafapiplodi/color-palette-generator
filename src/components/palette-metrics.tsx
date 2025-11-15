import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart3, Zap, Eye, Palette as PaletteIcon } from 'lucide-react';
import type { PaletteColor } from '@/utils/colorTheory';
import { getContrastRatio } from '@/utils/colorTheory';
import { getColorTemperature, getColorBrightness } from '@/utils/colorHelpers';

interface PaletteMetricsProps {
  palette: PaletteColor[];
}

export function PaletteMetrics({ palette }: PaletteMetricsProps) {
  // Calculate accessibility score (0-100)
  const calculateAccessibilityScore = (): number => {
    if (palette.length < 2) return 0;

    let passingPairs = 0;
    let totalPairs = 0;

    for (let i = 0; i < palette.length; i++) {
      for (let j = i + 1; j < palette.length; j++) {
        const ratio = getContrastRatio(palette[i].hex, palette[j].hex);
        totalPairs++;
        if (ratio >= 4.5) passingPairs++;
      }
    }

    return Math.round((passingPairs / totalPairs) * 100);
  };

  // Calculate harmony score (0-100)
  const calculateHarmonyScore = (): number => {
    // Simple heuristic: palette with varied but balanced hues scores higher
    const hues = palette.map(c => c.hsl.h);
    const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length;
    const variance = hues.reduce((sum, h) => sum + Math.pow(h - avgHue, 2), 0) / hues.length;

    // Good variance is between 1000-10000
    const normalized = Math.min(variance / 10000, 1);
    return Math.round(normalized * 100);
  };

  // Calculate uniqueness score (0-100)
  const calculateUniquenessScore = (): number => {
    // Check color diversity (saturation and lightness variance)
    const saturations = palette.map(c => c.hsl.s);
    const lightnesses = palette.map(c => c.hsl.l);

    const satVariance = saturations.reduce((sum, s, _i, arr) => {
      const avg = arr.reduce((a, b) => a + b) / arr.length;
      return sum + Math.pow(s - avg, 2);
    }, 0) / saturations.length;

    const lightVariance = lightnesses.reduce((sum, l, _i, arr) => {
      const avg = arr.reduce((a, b) => a + b) / arr.length;
      return sum + Math.pow(l - avg, 2);
    }, 0) / lightnesses.length;

    const score = Math.min((satVariance + lightVariance) / 10, 100);
    return Math.round(score);
  };

  // Temperature distribution
  const getTemperatureDistribution = () => {
    const temps = palette.map(c => getColorTemperature(c.hex));
    const warm = temps.filter(t => t === 'warm').length;
    const cool = temps.filter(t => t === 'cool').length;
    const neutral = temps.filter(t => t === 'neutral').length;
    return { warm, cool, neutral };
  };

  // Brightness distribution
  const getBrightnessDistribution = () => {
    const brightnesses = palette.map(c => getColorBrightness(c.hex));
    const avgBrightness = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
    const dark = brightnesses.filter(b => b < 33).length;
    const medium = brightnesses.filter(b => b >= 33 && b < 66).length;
    const light = brightnesses.filter(b => b >= 66).length;
    return { dark, medium, light, average: Math.round(avgBrightness) };
  };

  const accessibilityScore = calculateAccessibilityScore();
  const harmonyScore = calculateHarmonyScore();
  const uniquenessScore = calculateUniquenessScore();
  const tempDist = getTemperatureDistribution();
  const brightDist = getBrightnessDistribution();

  const getScoreBadge = (score: number) => {
    if (score >= 75) return { variant: 'success' as const, label: 'Excellent' };
    if (score >= 50) return { variant: 'warning' as const, label: 'Good' };
    return { variant: 'destructive' as const, label: 'Needs Work' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Palette Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scores */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Accessibility
              </span>
              <Badge variant={getScoreBadge(accessibilityScore).variant}>
                {accessibilityScore}%
              </Badge>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${accessibilityScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <PaletteIcon className="h-3 w-3" />
                Harmony
              </span>
              <Badge variant={getScoreBadge(harmonyScore).variant}>
                {harmonyScore}%
              </Badge>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${harmonyScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Uniqueness
              </span>
              <Badge variant={getScoreBadge(uniquenessScore).variant}>
                {uniquenessScore}%
              </Badge>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${uniquenessScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Temperature Distribution */}
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">Temperature Distribution</p>
          <div className="flex gap-2 text-sm">
            <Badge variant="outline">
              🔥 Warm: {tempDist.warm}
            </Badge>
            <Badge variant="outline">
              ❄️ Cool: {tempDist.cool}
            </Badge>
            <Badge variant="outline">
              ⚖️ Neutral: {tempDist.neutral}
            </Badge>
          </div>
        </div>

        {/* Brightness Distribution */}
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">Brightness Distribution</p>
          <div className="flex gap-2 text-sm">
            <Badge variant="outline">
              🌙 Dark: {brightDist.dark}
            </Badge>
            <Badge variant="outline">
              🌤️ Medium: {brightDist.medium}
            </Badge>
            <Badge variant="outline">
              ☀️ Light: {brightDist.light}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Average brightness: {brightDist.average}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
