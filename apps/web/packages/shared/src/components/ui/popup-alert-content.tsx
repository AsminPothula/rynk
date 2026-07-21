import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from './alert-dialog';
import { Button } from './button';
interface PopUpAlertProps {
  title: string;
  description?: string;
  cancelText: string;
  confirmText: string;
  hideText?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const PopUpAlertDialogContent = (props: PopUpAlertProps) => {
  const { onConfirm, title, description, cancelText, confirmText, hideText } =
    props;

  const TitleWrapper = hideText ? VisuallyHidden : AlertDialogHeader;

  return (
    <AlertDialogContent>
      <TitleWrapper>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description ? (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        ) : null}
      </TitleWrapper>
      <AlertDialogFooter className="mt-5 justify-center sm:justify-center">
        <AlertDialogCancel>{cancelText}</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="destructive" onClick={() => onConfirm?.()}>
            {confirmText}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
