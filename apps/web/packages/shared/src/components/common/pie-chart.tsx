import { Pie, PieChart as PC, Label } from 'recharts';
import { useMemo } from 'react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

export interface PieChartDataItem {
  name: string;
  value: number;
  color: string;
  label: string;
}

export interface PieChartProps {
  data: PieChartDataItem[];
  centerLabel?: string;
  className?: string;
}

export default function PieChart({
  data,
  centerLabel,
  className,
}: PieChartProps) {
  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {
      value: { label: centerLabel || 'Total' },
    };
    for (const item of data) {
      config[item.name] = { label: item.label, color: item.color };
    }
    return config;
  }, [data, centerLabel]);

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        name: item.name,
        value: item.value,
        fill: `var(--color-${item.name})`,
      })),
    [data],
  );

  const total = useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data],
  );

  if (!data.length) return null;

  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? 'mx-auto aspect-square h-[250px]'}>
      <PC>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold">
                      {total.toLocaleString()}
                    </tspan>
                    {centerLabel && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground">
                        {centerLabel}
                      </tspan>
                    )}
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PC>
    </ChartContainer>
  );
}
