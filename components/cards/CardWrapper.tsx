'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Social } from '@/components/shared/Social';
import Link from 'next/link';

interface CardWrapperProps {
  children: React.ReactNode;
  label: string;
  backLabel: string;
  backHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  label,
  backLabel,
  backHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className='w-[400px] shadow-md'>
      <CardHeader>
        <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
          <h1 className='text-3xl font-semibold'>🔐 Auth</h1>
          <p className='text-muted-foreground text-sm'>{label}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <Button
          className='font-normal w-full'
          variant={'link'}
          size={'sm'}
          asChild
        >
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
