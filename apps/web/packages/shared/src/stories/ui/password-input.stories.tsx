import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from '../../components/ui/password-input';
import { Label } from '../../components/ui/label';

const meta: Meta<typeof PasswordInput> = {
  title: 'UI/PasswordInput',
  component: PasswordInput,
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-sm space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default
        </h3>
        <PasswordInput placeholder="Enter password" />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Label
        </h3>
        <div className="space-y-2">
          <Label htmlFor="pw-label">Password</Label>
          <PasswordInput id="pw-label" placeholder="Enter your password" />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Value
        </h3>
        <PasswordInput defaultValue="supersecret123" />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Disabled
        </h3>
        <PasswordInput
          disabled
          defaultValue="canttouch"
          placeholder="Disabled"
        />
      </div>
    </div>
  ),
};
