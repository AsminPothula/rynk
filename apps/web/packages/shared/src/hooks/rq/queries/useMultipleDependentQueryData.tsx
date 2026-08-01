import { ReactQueryKey } from '../../../common/constant';
import { DataCardProps } from '../../../components/common/data-card';
import { SalesProps } from '../../../components/common/sales-card';
import { useApiContext } from '../../../providers/ApiProvider';
import { useQueries, useQuery } from '@tanstack/react-query';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { DummyMoney } from '../../../lib/helper';
import { wait } from '../../../lib/helper';

async function fetchBarData() {
  const data = [
    { name: 'Jan', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Feb', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Mar', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Apr', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'May', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Jun', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Jul', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Aug', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Sep', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Oct', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Nov', total: DummyMoney.getRandomAmount(5000, 1000) },
    { name: 'Dec', total: DummyMoney.getRandomAmount(5000, 1000) },
  ];

  await wait(1000);
  return data;
}

async function fetchDataCard() {
  const cardData: DataCardProps[] = [
    {
      label: 'Total Revenue',
      amount: '+' + DummyMoney.getRandomMoney(55000, 1000),
      description: '+20.1% from last month',
      icon: DollarSign,
    },
    {
      label: 'Subscriptions',
      amount: '+' + DummyMoney.getRandomMoney(2000, 1000),
      description: '+180.1% from last month',
      icon: Users,
    },
    {
      label: 'Sales',
      amount: '+' + DummyMoney.getRandomMoney(10000, 1000),
      description: '+19% from last month',
      icon: CreditCard,
    },
    {
      label: 'Active Now',
      amount: '+' + DummyMoney.getRandomMoney(500, 100),
      description: '+201 since last hour',
      icon: Activity,
    },
  ];

  return { cardData, salesId: (Math.random() * 1).toFixed(0) };
}

export const useGetData = () => {
  return useQueries({
    queries: [
      { queryKey: [ReactQueryKey.Data], queryFn: fetchDataCard },
      { queryKey: [ReactQueryKey.BarData], queryFn: fetchBarData },
    ],
  });
};

export const useGetSalesData = (salesId?: string) => {
  const api = useApiContext();

  return useQuery({
    queryKey: [ReactQueryKey.Sales, salesId],
    enabled: !!salesId,
    queryFn: async () => {
      if (!salesId) throw new Error('No salesId provided');
      const { data } = await api.userApi.getUsers(5, 0);

      const salesData = data.items.map((u) => {
        const name = u.firstName + ' ' + u.lastName;
        const email = u.email;
        return {
          name,
          email,
          saleAmount: DummyMoney.getRandomMoney(),
        };
      });

      const userSalesData: SalesProps[] = [
        ...salesData,
        {
          name: 'Seller - ' + salesId,
          email: 'company@example.com',
          saleAmount: DummyMoney.getRandomMoney(),
        },
      ];

      await wait(1000);
      return userSalesData;
    },
  });
};
