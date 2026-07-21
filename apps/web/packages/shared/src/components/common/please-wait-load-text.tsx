import { LoaderCircle } from 'lucide-react';

export function PleaseWaitLoadText({ text }: { text: string }) {
  return (
    <>
      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> <>{text}</>
    </>
  );
}
