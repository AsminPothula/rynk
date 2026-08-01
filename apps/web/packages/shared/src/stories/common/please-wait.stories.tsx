import type { Meta, StoryObj } from '@storybook/react';
import { PleaseWaitLoadText } from '../../components/common/please-wait-load-text';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof PleaseWaitLoadText> = {
  title: 'Common/PleaseWaitLoadText',
  component: PleaseWaitLoadText,
};

export default meta;
type Story = StoryObj<typeof PleaseWaitLoadText>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Inline
        </h3>
        <div className="flex items-center">
          <PleaseWaitLoadText text="Please wait..." />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Inside Disabled Button
        </h3>
        <Button disabled>
          <PleaseWaitLoadText text="Submitting..." />
        </Button>
      </div>
    </div>
  ),
};
