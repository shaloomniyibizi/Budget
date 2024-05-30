import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';
import SkeletonWrapper from '@/components/cards/SkeletonWrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TransactionType } from '@/lib/types';

import { GetFormatterForCurrency, dateToUTCDate } from '@/lib/utils';
import { UserCurrency } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface CategoriesStatsProps {
  userCurrency: UserCurrency;
  from: Date;
  to: Date;
}
export function CategoriesStats({
  userCurrency,
  from,
  to,
}: CategoriesStatsProps) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${dateToUTCDate(from)}&to=${dateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userCurrency.currency as string);
  }, [userCurrency.currency]);

  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap lg:flex-wrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCards
          formatter={formatter}
          type={'income'}
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCards
          formatter={formatter}
          type={'expense'}
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

function CategoriesCards({
  formatter,
  type,
  data,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatsResponseType;
}) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className='w-full col-span-6 h-full'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
          {type === 'income' ? 'Incomes' : 'Expenses'} by category
        </CardTitle>
      </CardHeader>

      <div className='flex items-center justify-between gap-2'>
        {filteredData.length === 0 && (
          <div className='flex h-40 w-full flex-col items-center justify-center'>
            No data for the selected period
            <p className='text-sm text-muted-foreground'>
              Try selecting a different period or try adding new{' '}
              {type === 'income' ? 'incomes' : 'expenses'}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className='h-40 w-full px-4'>
            <div className='flex w-full flex-col gap-4 p-4'>
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <span className='flex items-center text-gray-400'>
                        {item.categoryIcon} {item.category}
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className='text-sm text-gray-400'>
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
