import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const meta: Meta = {
  title: 'UI/Sheet',
};

export default meta;
type Story = StoryObj;

const sides = ['right', 'left', 'top', 'bottom'] as const;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">
        All 4 Sides
      </h3>
      <div className="flex flex-wrap gap-4">
        {sides.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Edit Profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile. Click save when you are done.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor={`sheet-name-${side}`}>Name</Label>
                  <Input id={`sheet-name-${side}`} defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`sheet-username-${side}`}>Username</Label>
                  <Input
                    id={`sheet-username-${side}`}
                    defaultValue="@johndoe"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  ),
};
