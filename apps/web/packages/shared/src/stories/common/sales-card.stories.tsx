import type { Meta, StoryObj } from '@storybook/react';
import SalesCard from '../../components/common/sales-card';

const meta: Meta<typeof SalesCard> = {
  title: 'Common/SalesCard',
  component: SalesCard,
};

export default meta;
type Story = StoryObj<typeof SalesCard>;

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
    <div className="max-w-md">
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">
        Sales Entries
      </h3>
      <div className="space-y-4">
        {salesData.map((sale, i) => (
          <SalesCard key={i} {...sale} />
        ))}
      </div>
    </div>
  ),
};
