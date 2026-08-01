import type { Meta, StoryObj } from '@storybook/react';
import LineChart from '../../components/common/line-chart';
import type {
  LineChartDataItem,
  LineChartSeries,
} from '../../components/common/line-chart';

const meta: Meta<typeof LineChart> = {
  title: 'Common/LineChart',
  component: LineChart,
};

export default meta;
type Story = StoryObj<typeof LineChart>;

const sampleData: LineChartDataItem[] = [
  { label: 'January', desktop: 186, mobile: 80 },
  { label: 'February', desktop: 305, mobile: 200 },
  { label: 'March', desktop: 237, mobile: 120 },
  { label: 'April', desktop: 73, mobile: 190 },
  { label: 'May', desktop: 209, mobile: 130 },
  { label: 'June', desktop: 214, mobile: 140 },
];

const series: LineChartSeries[] = [
  { dataKey: 'desktop', color: 'hsl(var(--chart-1))', label: 'Desktop' },
  { dataKey: 'mobile', color: 'hsl(var(--chart-2))', label: 'Mobile' },
];

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Sample Data (2 Series)
        </h3>
        <div className="max-w-2xl">
          <LineChart data={sampleData} series={series} />
        </div>
      </div>
    </div>
  ),
};
