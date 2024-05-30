import { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';
import { getCurrencyByUserId } from '@/lib/data/currency';
import TransactionDialog from './_components/TransactionDialog';
import Overview from './_components/Overview';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
};

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) redirect('/login');

  const userCurrency = await getCurrencyByUserId(user.id);

  if (!userCurrency) redirect('/wizard');

  return (
    <div className='flex-col flex w-full'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
          <div className='flex items-center space-x-2'>
            <TransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 '
                >
                  New Incomes 🥳
                </Button>
              }
              type='income'
            />
            <TransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className='border-rose-500 bg-rose-950 text-white hover:bg-rose-700 '
                >
                  New Expenses 😢
                </Button>
              }
              type='expense'
            />
          </div>
        </div>
        <Overview userCurrency={userCurrency} />
      </div>
    </div>
  );
}
