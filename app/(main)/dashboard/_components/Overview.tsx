'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesStats } from './CategoriesStats';
import { UserCurrency } from '@prisma/client';
import { OverviewChart } from './OverviewChart';
import { differenceInDays, startOfMonth } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { toast } from 'sonner';
import { StatsCards } from './StatsCards';

const Overview = ({ userCurrency }: { userCurrency: UserCurrency }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <Tabs defaultValue='overview' className='space-y-4'>
      <div className='flex justify-between items-center w-full'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='analytics' disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value='reports' disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value='notifications' disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <div className='flex items-center gap-3'>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big, Max allowed range is ${MAX_DATE_RANGE_DAYS} days`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>

      <TabsContent value='overview' className='space-y-4'>
        <StatsCards
          userCurrency={userCurrency}
          from={dateRange.from}
          to={dateRange.to}
        />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <OverviewChart userCurrency={userCurrency} />
          </div>

          <div className='col-span-4 row-start-1 lg:row-start-auto h-full lg:col-span-3'>
            <CategoriesStats
              userCurrency={userCurrency}
              from={dateRange.from}
              to={dateRange.to}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Overview;
