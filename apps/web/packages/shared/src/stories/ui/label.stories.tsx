import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
};

export default meta;
type Story = StoryObj<typeof Label>;

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-sm space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Standalone
        </h3>
        <Label>Username</Label>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Input
        </h3>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Disabled Peer
        </h3>
        <div className="space-y-2">
          <Label htmlFor="disabled-input">Disabled Field</Label>
          <Input
            id="disabled-input"
            disabled
            placeholder="Cannot edit"
            className="peer"
          />
        </div>
      </div>
    </div>
  ),
};
