import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function LoadingPage() {
  return (
    <>
      <div className='flex items-center justify-between w-full p-8'>
        <Skeleton className='h-12 w-32' />
        <div className='flex gap-2'>
          <Skeleton className='h-12 w-12' />
          <Skeleton className='h-12 w-12' />
        </div>
      </div>
      <div className='flex items-center justify-between w-full'>
        <Skeleton className='h-12 w-64' />
        <Skeleton className='h-12 w-24' />
      </div>
    </>
  );
}

export default LoadingPage;
