import type { Meta, StoryObj } from '@storybook/react';
import { DashboardSales } from '../../components/common/dashboard-sales';

const meta: Meta<typeof DashboardSales> = {
  title: 'Common/DashboardSales',
  component: DashboardSales,
};

export default meta;
type Story = StoryObj<typeof DashboardSales>;

const salesData = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    saleAmount: '+$1,999.00',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    saleAmount: '+$39.00',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    saleAmount: '+$299.00',
  },
  { name: 'William Kim', email: 'will@email.com', saleAmount: '+$99.00' },
];

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-md space-y-10">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Data + Subtitle
        </h3>
        <DashboardSales
          salesData={salesData}
          isLoading={false}
          subtitle="You made 265 sales this month."
        />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Loading State
        </h3>
        <DashboardSales isLoading={true} />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          No Data (empty)
        </h3>
        <DashboardSales salesData={[]} isLoading={false} />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Custom Title, No Subtitle
        </h3>
        <DashboardSales
          salesData={salesData.slice(0, 2)}
          isLoading={false}
          title="Top Performers"
        />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Loading with Existing Data (refresh)
        </h3>
        <DashboardSales
          salesData={salesData}
          isLoading={true}
          subtitle="Refreshing..."
        />
      </div>
    </div>
  ),
};
