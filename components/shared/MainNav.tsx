'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/lib/config/site';
import { cn } from '@/lib/utils';

import { Accessibility } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className='mr-4 hidden md:flex'>
      <Link href='/' className='mr-6 flex items-center space-x-2'>
        <Accessibility className='h-6 w-6' />
        <span className='hidden font-bold sm:inline-block'>
          {siteConfig.name}
        </span>
      </Link>
      <nav className='flex items-center gap-4 text-sm lg:gap-6'>
        <Link
          href='/about'
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/about' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          About
        </Link>
        <Link
          href='/abou/contact'
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/about/components')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Contacts
        </Link>
      </nav>
    </div>
  );
}
