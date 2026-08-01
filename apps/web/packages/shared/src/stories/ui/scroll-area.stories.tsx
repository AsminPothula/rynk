import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Vertical List (50 items)
        </h3>
        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i}>
                <div className="text-sm">Tag {i + 1}</div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Long Content
        </h3>
        <ScrollArea className="h-64 w-full max-w-md rounded-md border p-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Terms of Service</h4>
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i} className="text-muted-foreground text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  ),
};
