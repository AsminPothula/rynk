import type { Meta, StoryObj } from '@storybook/react';
import {
  Mail,
  Loader2,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Variants
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Sizes
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Icons
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button>
            <Mail className="mr-2 h-4 w-4" /> Login with Email
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="secondary">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost">
            Open <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Disabled
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled>Default</Button>
          <Button variant="destructive" disabled>
            Destructive
          </Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
          <Button variant="link" disabled>
            Link
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Loading States
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </Button>
          <Button variant="destructive" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
          </Button>
          <Button variant="outline" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
          </Button>
          <Button variant="secondary" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Icon-Only Buttons
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="icon" variant="default">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Mail className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Full Width
        </h3>
        <div className="max-w-sm space-y-2">
          <Button className="w-full">Sign In</Button>
          <Button variant="outline" className="w-full">
            Create Account
          </Button>
          <Button variant="destructive" className="w-full" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
          </Button>
        </div>
      </div>
    </div>
  ),
};
