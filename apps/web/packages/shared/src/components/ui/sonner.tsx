import { Toaster as Sonner } from 'sonner';
import { useThemeStore } from '../../state/useThemeStore';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useThemeStore((s) => s.theme);

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster };
