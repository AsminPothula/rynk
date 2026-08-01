import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '../../components/common/empty-state';
import {
  FileQuestion,
  Search,
  ShoppingCart,
  Users,
  FolderOpen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { DataCardContent } from '../../components/common/data-card';

const meta: Meta<typeof EmptyState> = {
  title: 'Common/EmptyState',
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-2xl space-y-10">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default (Inbox icon)
        </h3>
        <div className="rounded-lg border">
          <EmptyState />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Message
        </h3>
        <div className="rounded-lg border">
          <EmptyState
            title="No results found"
            message="Try adjusting your search or filter to find what you're looking for."
          />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Different Icons for Different Contexts
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border">
            <EmptyState
              title="No documents"
              icon={FileQuestion}
              message="Upload a file to get started."
            />
          </div>
          <div className="rounded-lg border">
            <EmptyState
              title="No results"
              icon={Search}
              message="Try a different query."
            />
          </div>
          <div className="rounded-lg border">
            <EmptyState
              title="Cart is empty"
              icon={ShoppingCart}
              message="Browse products."
            />
          </div>
          <div className="rounded-lg border">
            <EmptyState
              title="No team members"
              icon={Users}
              message="Invite people."
            />
          </div>
          <div className="rounded-lg border">
            <EmptyState
              title="No projects"
              icon={FolderOpen}
              message="Create your first project."
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Inside a Card
        </h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No activity yet"
              message="Actions will appear here."
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Inside Dashboard Widget
        </h3>
        <DataCardContent className="w-[350px]">
          <p className="p-4 font-semibold">Recent Sales</p>
          <EmptyState
            title="No sales yet"
            message="Sales data will appear here."
          />
        </DataCardContent>
      </div>
    </div>
  ),
};
