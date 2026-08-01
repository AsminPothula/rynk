import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmActionAlert } from '../../components/common/confirm-action-alert';

const meta: Meta<typeof ConfirmActionAlert> = {
  title: 'Common/ConfirmActionAlert',
  component: ConfirmActionAlert,
};

export default meta;
type Story = StoryObj<typeof ConfirmActionAlert>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default Delete Button
        </h3>
        <ConfirmActionAlert
          triggerLabel="Delete"
          title="Delete this item?"
          description="This action cannot be undone. The item will be permanently removed."
          cancelText="Cancel"
          confirmText="Delete"
          onConfirm={() => {}}
        />
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Destructive Variant
        </h3>
        <ConfirmActionAlert
          triggerLabel="Remove Account"
          triggerVariant="destructive"
          title="Remove your account?"
          description="All your data will be permanently deleted. This cannot be undone."
          cancelText="Keep Account"
          confirmText="Yes, Remove"
          onConfirm={() => {}}
        />
      </div>
    </div>
  ),
};
