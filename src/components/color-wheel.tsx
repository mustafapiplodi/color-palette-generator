import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import type { PaletteColor } from '@/utils/colorTheory';

interface ColorWheelProps {
  palette: PaletteColor[];
}

export function ColorWheel({ palette }: ColorWheelProps) {
  if (palette.length === 0) return null;

  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 40;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Wheel</CardTitle>
        <CardDescription>
          Visualize your palette on the color wheel
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Background circle */}
          <defs>
            <radialGradient id="wheelGradient">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0f0f0" />
            </radialGradient>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="url(#wheelGradient)"
            stroke="#e0e0e0"
            strokeWidth="2"
          />

          {/* Color wheel segments */}
          {Array.from({ length: 360 }, (_, i) => i).filter(i => i % 10 === 0).map(angle => {
            const radian = (angle * Math.PI) / 180;
            const x1 = center + (radius - 20) * Math.cos(radian);
            const y1 = center + (radius - 20) * Math.sin(radian);
            const x2 = center + radius * Math.cos(radian);
            const y2 = center + radius * Math.sin(radian);

            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`hsl(${angle}, 100%, 50%)`}
                strokeWidth="2"
              />
            );
          })}

          {/* Palette colors as points */}
          {palette.map((color, _index) => {
            const angle = ((color.hsl.h - 90) * Math.PI) / 180;
            const distance = (color.hsl.s / 100) * (radius - 40);
            const x = center + distance * Math.cos(angle);
            const y = center + distance * Math.sin(angle);

            return (
              <g key={color.id}>
                {/* Connection line to center */}
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={color.hex}
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  strokeDasharray="4,4"
                />
                {/* Color point */}
                <circle
                  cx={x}
                  cy={y}
                  r="16"
                  fill={color.hex}
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="drop-shadow"
                />
                {/* Label */}
                <text
                  x={x}
                  y={y + 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-current"
                  style={{ fontSize: '10px' }}
                >
                  {color.role}
                </text>
              </g>
            );
          })}

          {/* Center point */}
          <circle
            cx={center}
            cy={center}
            r="8"
            fill="#666"
            stroke="#fff"
            strokeWidth="2"
          />

          {/* Angle markers */}
          <text x={center + radius + 10} y={center + 5} className="text-xs fill-current">
            0°
          </text>
          <text x={center - 5} y={center - radius - 10} className="text-xs fill-current">
            90°
          </text>
          <text x={center - radius - 20} y={center + 5} className="text-xs fill-current">
            180°
          </text>
          <text x={center - 5} y={center + radius + 20} className="text-xs fill-current">
            270°
          </text>
        </svg>
      </CardContent>
      <div className="px-6 pb-6">
        <p className="text-xs text-muted-foreground text-center">
          Each color is positioned based on its hue (angle) and saturation (distance from center)
        </p>
      </div>
    </Card>
  );
}
