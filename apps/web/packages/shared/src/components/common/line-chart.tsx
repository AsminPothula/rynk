import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

export interface LineChartDataItem {
  label: string;
  [key: string]: string | number;
}

export interface LineChartSeries {
  dataKey: string;
  color: string;
  label: string;
}

export interface LineChartProps {
  data: LineChartDataItem[];
  series: LineChartSeries[];
  labelKey?: string;
  className?: string;
}

export default function LineChart({
  data,
  series,
  labelKey = 'label',
  className,
}: LineChartProps) {
  const chartId = useId();

  const chartConfig = series.reduce<ChartConfig>((acc, s) => {
    acc[s.dataKey] = { label: s.label, color: s.color };
    return acc;
  }, {});

  if (!data.length) return null;

  return (
    <ChartContainer config={chartConfig} className={className}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={labelKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.dataKey}
              id={`fill-${s.dataKey}-${chartId}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1">
              <stop
                offset="5%"
                stopColor={`var(--color-${s.dataKey})`}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${s.dataKey})`}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>
        {series.map((s) => (
          <Area
            key={s.dataKey}
            dataKey={s.dataKey}
            type="natural"
            fill={`url(#fill-${s.dataKey}-${chartId})`}
            fillOpacity={0.4}
            stroke={`var(--color-${s.dataKey})`}
            stackId="a"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
