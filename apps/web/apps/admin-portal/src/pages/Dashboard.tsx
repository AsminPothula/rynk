import DataCard from '@shared/components/common/data-card';
import PageTitle from '@shared/components/common/page-title';
import { DashboardOverview } from '@shared/components/common/dashboard-overview';
import { DashboardSales } from '@shared/components/common/dashboard-sales';
import { SectionLoader } from '@shared/components/common/section-loader';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import {
  useGetData,
  useGetSalesData,
} from '@/hooks/rq/queries/useMultipleDependentQueryData';

export function Dashboard() {
  const { t } = useLanguageTranslation();

  const [
    {
      data: mainData,
      isLoading: mainDataLoading,
      isFetching: mainDataFetching,
    },
    { data: barData, isLoading: barLoading, isFetching: barFetching },
  ] = useGetData();
  const {
    data: userSalesData,
    isLoading: salesLoading,
    isFetching: salesFetching,
  } = useGetSalesData(mainData?.salesId);

  return (
    <div className="flex w-full flex-col gap-5">
      <PageTitle title={t('DASHBOARD.TITLE')} />

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <DashboardOverview
          barData={barData}
          isLoading={barLoading || barFetching}
        />
        <DashboardSales
          salesData={userSalesData}
          isLoading={salesLoading || salesFetching}
        />
      </section>
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        <SectionLoader
          isLoading={mainDataLoading || mainDataFetching}
          size="lg"
        />
        {mainData?.cardData.map((d, i) => (
          <DataCard
            key={i}
            amount={d.amount}
            description={d.description}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </section>
    </div>
  );
}
