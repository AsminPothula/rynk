import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import {
  Search,
  Mail,
  Lock,
  Eye,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-md space-y-10">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Types
        </h3>
        <div className="space-y-3">
          <Input type="text" placeholder="Text input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
          <Input type="number" placeholder="Number input" />
          <Input type="search" placeholder="Search input" />
          <Input type="file" />
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          States
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Default</Label>
            <Input placeholder="Enter value..." />
          </div>
          <div className="space-y-1">
            <Label>With Value</Label>
            <Input defaultValue="Hello World" />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">Disabled</Label>
            <Input disabled placeholder="Can't interact" />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">Disabled with Value</Label>
            <Input disabled defaultValue="Locked content" />
          </div>
          <div className="space-y-1">
            <Label>Read Only</Label>
            <Input readOnly defaultValue="Read-only content" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Validation States (via wrapper)
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="input-error">Email</Label>
            <Input
              id="input-error"
              type="email"
              defaultValue="invalid-email"
              className="border-destructive focus-visible:ring-destructive"
            />
            <p className="text-destructive flex items-center gap-1 text-xs">
              <AlertCircle className="h-3 w-3" /> Please enter a valid email
              address.
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="input-success">Username</Label>
            <Input
              id="input-success"
              defaultValue="johndoe"
              className="border-green-500 focus-visible:ring-green-500"
            />
            <p className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" /> Username is available.
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="input-warning">Password</Label>
            <Input
              id="input-warning"
              type="password"
              defaultValue="abc"
              className="border-yellow-500 focus-visible:ring-yellow-500"
            />
            <p className="flex items-center gap-1 text-xs text-yellow-600">
              <AlertCircle className="h-3 w-3" /> Password is too weak.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Icons (via wrapper)
        </h3>
        <div className="space-y-3">
          <div className="relative">
            <Mail className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
            <Input className="pl-9" placeholder="Email" type="email" />
          </div>
          <div className="relative">
            <Lock className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
            <Input
              className="pl-9 pr-9"
              placeholder="Password"
              type="password"
            />
            <Eye className="text-muted-foreground absolute right-3 top-3 h-4 w-4 cursor-pointer" />
          </div>
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
            <Input className="pl-9" placeholder="Search..." type="search" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Composite Patterns
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search..." />
            <Button size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};
