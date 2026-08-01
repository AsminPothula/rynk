import type { Meta, StoryObj } from '@storybook/react';
import { DashboardOverview } from '../../components/common/dashboard-overview';

const meta: Meta<typeof DashboardOverview> = {
  title: 'Common/DashboardOverview',
  component: DashboardOverview,
};

export default meta;
type Story = StoryObj<typeof DashboardOverview>;

const fullYearData = [
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

const sparseData = [
  { name: 'Q1', total: 4100 },
  { name: 'Q2', total: 5800 },
  { name: 'Q3', total: 6500 },
  { name: 'Q4', total: 9300 },
];

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-2xl space-y-10">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Data
        </h3>
        <DashboardOverview barData={fullYearData} isLoading={false} />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Loading State
        </h3>
        <DashboardOverview isLoading={true} />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          No Data (empty)
        </h3>
        <DashboardOverview barData={[]} isLoading={false} />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Custom Title
        </h3>
        <DashboardOverview
          barData={sparseData}
          isLoading={false}
          title="Quarterly Revenue"
        />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Loading with Existing Data (refresh)
        </h3>
        <DashboardOverview barData={fullYearData} isLoading={true} />
      </div>
    </div>
  ),
};
