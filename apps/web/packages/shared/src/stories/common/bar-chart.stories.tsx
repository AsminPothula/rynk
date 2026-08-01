import type { Meta, StoryObj } from '@storybook/react';
import BarChart from '../../components/common/bar-chart';

const meta: Meta<typeof BarChart> = {
  title: 'Common/BarChart',
  component: BarChart,
};

export default meta;
type Story = StoryObj<typeof BarChart>;

const sampleData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 800 },
  { name: 'Apr', total: 1600 },
  { name: 'May', total: 2400 },
  { name: 'Jun', total: 1800 },
  { name: 'Jul', total: 2200 },
  { name: 'Aug', total: 1500 },
  { name: 'Sep', total: 2800 },
  { name: 'Oct', total: 3200 },
  { name: 'Nov', total: 2600 },
  { name: 'Dec', total: 3500 },
];

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default with Sample Data
        </h3>
        <div className="max-w-2xl">
          <BarChart data={sampleData} />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          No Data
        </h3>
        <div className="max-w-2xl">
          <BarChart data={undefined} />
          <p className="text-muted-foreground text-sm">
            Nothing renders when data is undefined.
          </p>
        </div>
      </div>
    </div>
  ),
};
