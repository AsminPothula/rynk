import SharedExamplesDemo from '@shared/components/common/example-demo';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';

export default function ExamplesDemo({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useLanguageTranslation();
  return (
    <SharedExamplesDemo
      className={className}
      t={t as (key: string) => string}
    />
  );
}
