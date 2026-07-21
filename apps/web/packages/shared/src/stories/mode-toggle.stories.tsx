import type { Meta, StoryObj } from '@storybook/react';
import { ModeToggle } from '../components/mode-toggle';

const meta: Meta<typeof ModeToggle> = {
  title: 'UI/ModeToggle',
  component: ModeToggle,
};

export default meta;
type Story = StoryObj<typeof ModeToggle>;

export const AllVariations: Story = {
  render: () => (
    <div>
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">
        Theme Toggle
      </h3>
      <ModeToggle />
    </div>
  ),
};
