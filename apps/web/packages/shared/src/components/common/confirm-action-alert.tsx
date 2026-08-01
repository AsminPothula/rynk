import { Button } from '../ui/button';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { PopUpAlertDialogContent } from '../ui/popup-alert-content';
import type { ButtonProps } from '../ui/button';

export interface ConfirmActionAlertProps {
  triggerLabel: string;
  triggerVariant?: ButtonProps['variant'];
  triggerSize?: ButtonProps['size'];
  triggerClassName?: string;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
}

export function ConfirmActionAlert({
  triggerLabel,
  triggerVariant = 'default',
  triggerSize,
  triggerClassName,
  title,
  description,
  cancelText,
  confirmText,
  onConfirm,
}: ConfirmActionAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}>
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <PopUpAlertDialogContent
        title={title}
        description={description}
        cancelText={cancelText}
        confirmText={confirmText}
        onConfirm={onConfirm}
      />
    </AlertDialog>
  );
}
