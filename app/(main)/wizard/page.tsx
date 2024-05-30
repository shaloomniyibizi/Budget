import CurrencyComboBox from '@/components/shared/CurrencyComboBox';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/utils/userAuth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

async function WizardPage() {
  const user = await currentUser();
  if (!user) redirect('/login');

  if (user.onboarded === false) redirect('/onboarding');

  return (
    <div className='container flex max-w-2xl flex-col items-center justify-between gap-4'>
      <div className=''>
        <h1 className='text-center text-3xl'>
          {' '}
          Welcome, <span className='ml-2 font-bold'>{user.name} 👋</span>
        </h1>
        <h2 className='mt-4 text-center text-base text-muted-foreground'>
          Let s get started by setting your currency
        </h2>
        <h3 className='text-center text-sm text-muted-foreground'>
          You can change this settings any time
        </h3>
      </div>
      <Separator />
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button className='w-full' asChild>
        <Link href={'/dashboard'}>I done take me to dashboard</Link>
      </Button>
    </div>
  );
}

export default WizardPage;
