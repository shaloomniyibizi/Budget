'use client';

import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetFormatterForCurrency, dateToUTCDate } from '@/lib/utils';
import CountUp from 'react-countup';
import { UserCurrency } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Percent, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { ReactNode, useCallback, useMemo } from 'react';
import SkeletonWrapper from '@/components/cards/SkeletonWrapper';

interface StatsCardsProps {
  userCurrency: UserCurrency;
  from: Date;
  to: Date;
}
export const StatsCards = ({ userCurrency, from, to }: StatsCardsProps) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userCurrency.currency as string);
  }, [userCurrency.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  const incomeDescription = `Money you gain fom ${from.getDate()} / ${from.getMonth()} / ${from.getFullYear()} up-to ${to.getDate()}/${to.getMonth()}/${to.getFullYear()}`;

  const expenseDescription = `Money you spend fom ${from.getDate()}/${from.getMonth()}/${from.getFullYear()} up-to ${to.getDate()}/${to.getMonth()}/${to.getFullYear()}`;

  const balanceDescription = `Money you save fom ${from.getDate()}/${from.getMonth()}/${from.getFullYear()} up-to ${to.getDate()}/${to.getMonth()}/${to.getFullYear()}`;

  return (
    <div className='relative flex flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={income}
          desc={incomeDescription}
          title={'Income'}
          icon={
            <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10' />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={expense}
          desc={expenseDescription}
          title={'Expense'}
          icon={
            <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10' />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
          formatter={formatter}
          value={balance}
          desc={balanceDescription}
          title={'Balance'}
          icon={
            <Wallet className='h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10' />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

function StatsCard({
  formatter,
  value,
  desc,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  desc: string;
  title: string;
  icon: ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 w-full'>
        <CardTitle className='text-sm font-medium'>Total {title}</CardTitle>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
        </svg>
      </CardHeader>
      <CardContent className='flex items-center gap-2'>
        {icon}
        <div className='flex flex-col '>
          <CountUp
            preserveValue
            redraw={false}
            end={value}
            decimals={0}
            decimal=','
            formattingFn={formatFn}
            className='text-2xl'
          />
          <p className='text-xs text-muted-foreground '>{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
