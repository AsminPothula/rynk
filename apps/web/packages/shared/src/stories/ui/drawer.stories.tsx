import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../components/ui/drawer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const meta: Meta = {
  title: 'UI/Drawer',
};

export default meta;
type Story = StoryObj;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Edit Form Drawer
        </h3>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here.
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 px-4">
              <div className="space-y-2">
                <Label htmlFor="drawer-name">Name</Label>
                <Input id="drawer-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drawer-email">Email</Label>
                <Input
                  id="drawer-email"
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <DrawerFooter>
              <Button>Save changes</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Confirmation Drawer
        </h3>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="destructive">Delete Item</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone. This will permanently delete the
                item.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="destructive">Yes, delete</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  ),
};
