import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from '../../components/common/error-state';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { DataCardContent } from '../../components/common/data-card';

const meta: Meta<typeof ErrorState> = {
  title: 'Common/ErrorState',
  component: ErrorState,
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-2xl space-y-10">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default (title only)
        </h3>
        <div className="rounded-lg border">
          <ErrorState />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Message
        </h3>
        <div className="rounded-lg border">
          <ErrorState
            title="Failed to load data"
            message="The server returned an unexpected error. Please try again later."
          />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Retry
        </h3>
        <div className="rounded-lg border">
          <ErrorState
            title="Connection lost"
            message="Unable to reach the server."
            onRetry={() => alert('Retrying...')}
          />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Inside a Card
        </h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorState
              title="Profile unavailable"
              message="Could not load user profile."
              onRetry={() => alert('Retrying...')}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Inside Dashboard Widget
        </h3>
        <DataCardContent className="w-[350px]">
          <p className="p-4 font-semibold">Revenue Overview</p>
          <ErrorState
            title="Chart data failed"
            message="Unable to load revenue data."
            onRetry={() => alert('Retrying...')}
          />
        </DataCardContent>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Custom Title & No Retry
        </h3>
        <div className="rounded-lg border">
          <ErrorState
            title="Access denied"
            message="You don't have permission to view this resource. Contact your administrator."
          />
        </div>
      </div>
    </div>
  ),
};
