'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Period, TimeFrame } from '@/lib/types';
import { GetFormatterForCurrency, cn } from '@/lib/utils';
import { UserCurrency } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartPeriodSelector from './ChartPeriodSelector';
import SkeletonWrapper from '@/components/cards/SkeletonWrapper';
import { useQuery } from '@tanstack/react-query';
import { GetHistoryDataResponseType } from '@/app/api/chart-data/route';
import CountUp from 'react-countup';

export function OverviewChart({
  userCurrency,
}: {
  userCurrency: UserCurrency;
}) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userCurrency.currency as string);
  }, [userCurrency.currency]);

  const chartDataQuery = useQuery<GetHistoryDataResponseType>({
    queryKey: ['overview', 'history', timeframe, period],
    queryFn: () =>
      fetch(
        `/api/chart-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      ).then((res) => res.json()),
  });
  const dataAvailable = chartDataQuery.data && chartDataQuery.data.length > 0;

  return (
    <Card className='col-span-12 w-full'>
      <CardHeader className='gap-2'>
        <CardTitle className=' grid grid-flow-row justify-between gap-2 md:grid-flow-col'>
          <ChartPeriodSelector
            period={period}
            setPeriod={setPeriod}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <div className='flex h-10 gap-2'>
            <SkeletonWrapper isLoading={chartDataQuery.isFetching}>
              <Badge
                variant={'outline'}
                className='flex items-center gap-2 text-sm py-1'
              >
                <div className='h-4 w-4 rounded-full bg-emerald-500 ' /> Icome
              </Badge>
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={chartDataQuery.isFetching}>
              <Badge
                variant={'outline'}
                className='flex items-center gap-2 text-sm'
              >
                <div className='h-4 w-4 rounded-full bg-red-500 ' /> Expense
              </Badge>
            </SkeletonWrapper>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <SkeletonWrapper isLoading={chartDataQuery.isFetching}>
          {dataAvailable && (
            <ResponsiveContainer width='100%' height={350}>
              <BarChart data={chartDataQuery.data}>
                <defs>
                  <linearGradient id='incomeBar' x1={0} y1={0} x2={0} y2={1}>
                    <stop offset={'0'} stopColor='#10b981' stopOpacity={'1'} />
                    <stop offset={'1'} stopColor='#10b981' stopOpacity={'0'} />
                  </linearGradient>
                  <linearGradient id='expenseBar' x1={0} y1={0} x2={0} y2={1}>
                    <stop offset={'0'} stopColor='#ef4444' stopOpacity={'1'} />
                    <stop offset={'1'} stopColor='#ef4444' stopOpacity={'0'} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray={'5 5'}
                  strokeOpacity={'0.2'}
                  vertical={false}
                />

                <XAxis
                  dataKey={(data) => {
                    const { year, month, day } = data;
                    const date = new Date(year, month, day || 1);

                    if (timeframe === 'year') {
                      return date.toLocaleDateString('default', {
                        month: 'long',
                      });
                    }
                    return date.toLocaleDateString('default', {
                      day: '2-digit',
                    });
                  }}
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey={'income'}
                  label='Income'
                  fill='url(#incomeBar)'
                  radius={[4, 4, 0, 0]}
                  className='cursor-pointer'
                />
                <Bar
                  dataKey={'expense'}
                  label='Expense'
                  fill='url(#expenseBar)'
                  radius={[4, 4, 0, 0]}
                  className='cursor-pointer'
                />
                <Tooltip
                  cursor={{ opacity: 0.1 }}
                  content={(props) => (
                    <CustomTooltip formatter={formatter} {...props} />
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          {!dataAvailable && (
            <ResponsiveContainer
              width='100%'
              height={350}
              className={
                'flex flex-col items-center justify-center bg-background'
              }
            >
              <div className='text-center'>
                No data for the selected period{' '}
                <p className='text-sm text-muted-foreground'>
                  Try selecting a different period or adding new transaction
                </p>
              </div>
            </ResponsiveContainer>
          )}
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className='min-w-[300px] rounded border bg-background p-4'>
      <TooltipRow
        formatter={formatter}
        label='Expense'
        value={expense}
        bgColor='bg-red-500'
        textColor='text-red-500'
      />
      <TooltipRow
        formatter={formatter}
        label='Income'
        value={income}
        bgColor='bg-emerald-500'
        textColor='text-emerald-500'
      />
      <TooltipRow
        formatter={formatter}
        label='Balance'
        value={income - expense}
        bgColor='bg-gray-100'
        textColor='text-foreground'
      />
    </div>
  );
}

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  textColor: string;
  bgColor: string;
  value: number;
  formatter: Intl.NumberFormat;
}) {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className='flex items-center gap-2'>
      <div className={cn('h-4 w-4 rounded-full', bgColor)} />
      <div className='flex w-full justify-between'>
        <p className='text-sm text-muted-foreground'>{label}</p>
        <div className={cn('text-sm font-bold', textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            decimal=','
            formattingFn={formattingFn}
            className='text-sm'
          />
        </div>
      </div>
    </div>
  );
}
