import BarChart from './bar-chart';
import { DataCardContent } from './data-card';
import { SectionLoader } from './section-loader';

export interface DashboardOverviewProps {
  barData?: { name: string; total: number }[];
  isLoading: boolean;
  title?: string;
}

export function DashboardOverview({
  barData,
  isLoading,
  title = 'Overview',
}: DashboardOverviewProps) {
  return (
    <DataCardContent>
      <p className="relative flex p-4 font-semibold">
        {title}
        <SectionLoader
          isLoading={isLoading}
          size="sm"
          className="absolute right-0 mr-2"
        />
      </p>
      <BarChart data={barData} />
    </DataCardContent>
  );
}
