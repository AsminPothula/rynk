import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '../../components/ui/separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Horizontal with Text
        </h3>
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
          <p className="text-muted-foreground text-sm">
            An open-source UI component library.
          </p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>Blog</div>
          <Separator orientation="vertical" />
          <div>Docs</div>
          <Separator orientation="vertical" />
          <div>Source</div>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Vertical Between Inline Items
        </h3>
        <div className="flex h-5 items-center space-x-4 text-sm">
          <span>Dashboard</span>
          <Separator orientation="vertical" />
          <span>Settings</span>
          <Separator orientation="vertical" />
          <span>Profile</span>
          <Separator orientation="vertical" />
          <span>Logout</span>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          In a List
        </h3>
        <div className="max-w-sm">
          {['First item', 'Second item', 'Third item', 'Fourth item'].map(
            (item, i, arr) => (
              <div key={i}>
                <div className="py-3 text-sm">{item}</div>
                {i < arr.length - 1 && <Separator />}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  ),
};
