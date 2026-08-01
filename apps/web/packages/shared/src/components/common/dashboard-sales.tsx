import SalesCard from './sales-card';
import { DataCardContent } from './data-card';
import { SectionLoader } from './section-loader';
import type { SalesProps } from './sales-card';

export interface DashboardSalesProps {
  salesData?: SalesProps[];
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}

export function DashboardSales({
  salesData,
  isLoading,
  title = 'Recent Sales',
  subtitle,
}: DashboardSalesProps) {
  return (
    <DataCardContent className="flex justify-between gap-4">
      <section>
        <p className="relative flex">
          {title}
          <SectionLoader
            isLoading={isLoading}
            size="sm"
            className="absolute right-0 mr-2"
          />
        </p>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </section>

      {salesData?.map((d, i) => (
        <SalesCard
          key={i}
          email={d.email}
          name={d.name}
          saleAmount={d.saleAmount}
        />
      ))}
    </DataCardContent>
  );
}
