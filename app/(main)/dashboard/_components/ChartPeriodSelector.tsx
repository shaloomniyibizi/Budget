import { GetHistoryPeriodsResponseType } from '@/app/api/period/route';
import SkeletonWrapper from '@/components/cards/SkeletonWrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Period, TimeFrame } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface ChartPeriodSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: TimeFrame;
  setTimeframe: (timeframe: TimeFrame) => void;
}
function ChartPeriodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: ChartPeriodSelectorProps) {
  const historyPeriod = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ['overview', 'period'],
    queryFn: () => fetch('/api/period').then((res) => res.json()),
  });
  return (
    <div className=' flex flex-wrap items-center gap-4'>
      <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value='year'>Year</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className='flex  items-center gap-2'>
        <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriod.data || []}
          />
        </SkeletonWrapper>
        {timeframe === 'month' && (
          <SkeletonWrapper
            isLoading={historyPeriod.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default ChartPeriodSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({ month: period.month, year: parseInt(value) });
      }}
    >
      <SelectTrigger className='w-[90px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({ year: period.year, month: parseInt(value) });
      }}
    >
      <SelectTrigger className='w-[90px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthToString = new Date(period.year, month, 1).toLocaleString(
            'default',
            { month: 'long' }
          );

          return (
            <SelectItem key={month} value={month.toString()}>
              {monthToString}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
