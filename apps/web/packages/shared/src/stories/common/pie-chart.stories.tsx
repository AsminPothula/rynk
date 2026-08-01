import type { Meta, StoryObj } from '@storybook/react';
import PieChart from '../../components/common/pie-chart';
import type { PieChartDataItem } from '../../components/common/pie-chart';

const meta: Meta<typeof PieChart> = {
  title: 'Common/PieChart',
  component: PieChart,
};

export default meta;
type Story = StoryObj<typeof PieChart>;

const sampleData: PieChartDataItem[] = [
  { name: 'chrome', value: 275, color: 'hsl(var(--chart-1))', label: 'Chrome' },
  { name: 'safari', value: 200, color: 'hsl(var(--chart-2))', label: 'Safari' },
  {
    name: 'firefox',
    value: 187,
    color: 'hsl(var(--chart-3))',
    label: 'Firefox',
  },
  { name: 'edge', value: 173, color: 'hsl(var(--chart-4))', label: 'Edge' },
  { name: 'other', value: 90, color: 'hsl(var(--chart-5))', label: 'Other' },
];

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Sample Data
        </h3>
        <PieChart data={sampleData} />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Center Label
        </h3>
        <PieChart data={sampleData} centerLabel="Visitors" />
      </div>
    </div>
  ),
};
