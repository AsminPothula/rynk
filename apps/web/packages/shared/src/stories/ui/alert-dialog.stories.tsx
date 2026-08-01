import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { PopUpAlertDialogContent } from '../../components/ui/popup-alert-content';
import { Button } from '../../components/ui/button';

const meta: Meta = {
  title: 'UI/AlertDialog',
};

export default meta;
type Story = StoryObj;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Standard Delete Confirmation
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          PopUpAlertDialogContent Variant
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Remove Item</Button>
          </AlertDialogTrigger>
          <PopUpAlertDialogContent
            title="Remove this item?"
            description="This will remove the item from your list permanently."
            cancelText="Keep it"
            confirmText="Remove"
            onConfirm={() => {}}
          />
        </AlertDialog>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Hidden Title Variant
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost">Discard Changes</Button>
          </AlertDialogTrigger>
          <PopUpAlertDialogContent
            title="Discard unsaved changes?"
            cancelText="No"
            confirmText="Yes, discard"
            hideText
            onConfirm={() => {}}
          />
        </AlertDialog>
      </div>
    </div>
  ),
};
