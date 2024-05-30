'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import TransactionTable from './TransactionTable';

function TransactionPageWrapper() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className='border-b bg-card text-card-foreground'>
        <div className='p-8 flex flex-wrap items-center justify-between gap-6 py-8'>
          <div className=''>
            <p className='text-3xl font-bold'>Transaction history</p>
          </div>
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
      <TransactionTable from={dateRange.from} to={dateRange.to} />
    </>
  );
}

export default TransactionPageWrapper;
