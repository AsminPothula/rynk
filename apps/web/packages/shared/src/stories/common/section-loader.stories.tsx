import type { Meta, StoryObj } from '@storybook/react';
import { SectionLoader } from '../../components/common/section-loader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { DataCardContent } from '../../components/common/data-card';

const meta: Meta<typeof SectionLoader> = {
  title: 'Common/SectionLoader',
  component: SectionLoader,
};

export default meta;
type Story = StoryObj<typeof SectionLoader>;

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-2xl space-y-10">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Sizes
        </h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <SectionLoader isLoading size="sm" />
            <span className="text-muted-foreground text-xs">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SectionLoader isLoading size="md" />
            <span className="text-muted-foreground text-xs">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SectionLoader isLoading size="lg" />
            <span className="text-muted-foreground text-xs">Large</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Not Loading (hidden)
        </h3>
        <div className="flex items-center gap-2 rounded border p-4">
          <span className="text-sm">Loader is here but invisible:</span>
          <SectionLoader isLoading={false} size="md" />
          <span className="text-muted-foreground text-sm">
            (nothing renders)
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Inside a Card Header (inline pattern)
        </h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Activity
              <SectionLoader isLoading size="sm" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Loading content...</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Centered in a Container
        </h3>
        <DataCardContent className="flex h-40 w-[350px] items-center justify-center">
          <SectionLoader isLoading size="lg" />
        </DataCardContent>
      </div>
    </div>
  ),
};
