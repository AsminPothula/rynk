import type { Meta, StoryObj } from '@storybook/react';
import PageTitle from '../../components/common/page-title';

const meta: Meta<typeof PageTitle> = {
  title: 'Common/PageTitle',
  component: PageTitle,
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default Titles
        </h3>
        <div className="space-y-4">
          <PageTitle title="Dashboard" />
          <PageTitle title="Settings" />
          <PageTitle title="User Management" />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Custom Styled
        </h3>
        <PageTitle
          title="Custom Title"
          className="text-primary text-3xl italic"
        />
      </div>
    </div>
  ),
};
