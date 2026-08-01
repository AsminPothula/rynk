import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-lg space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Simple Card
        </h3>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Card content with some example text to demonstrate the layout.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Card with Footer
        </h3>
        <Card>
          <CardHeader>
            <CardTitle>Project Update</CardTitle>
            <CardDescription>Review changes before deploying.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your project has 3 pending changes ready for deployment.</p>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Login Form Card
        </h3>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign In</Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Notifications Card
        </h3>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Your call has been confirmed.', time: '1 hour ago' },
              { title: 'You have a new message!', time: '2 hours ago' },
              {
                title: 'Your subscription is expiring soon.',
                time: '5 hours ago',
              },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="bg-primary mt-1 h-2 w-2 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-muted-foreground text-xs">{n.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Mark all as read
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
};
