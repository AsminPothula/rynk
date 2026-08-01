import type { Meta, StoryObj } from '@storybook/react';
import DataCard from '../../components/common/data-card';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';

const meta: Meta<typeof DataCard> = {
  title: 'Common/DataCard',
  component: DataCard,
};

export default meta;
type Story = StoryObj<typeof DataCard>;

export const AllVariations: Story = {
  render: () => (
    <div>
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">
        Data Cards Grid
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DataCard
          label="Total Revenue"
          icon={DollarSign}
          amount="$45,231.89"
          description="+20.1% from last month"
        />
        <DataCard
          label="Subscriptions"
          icon={Users}
          amount="+2350"
          description="+180.1% from last month"
        />
        <DataCard
          label="Sales"
          icon={CreditCard}
          amount="+12,234"
          description="+19% from last month"
        />
        <DataCard
          label="Active Now"
          icon={Activity}
          amount="+573"
          description="+201 since last hour"
        />
      </div>
    </div>
  ),
};
