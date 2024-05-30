'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Accessibility, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import ThemeSwitcherButton from '@/components/shared/ThemeSwitcherButton';
import { UserButton } from '@/components/shared/UserButton';
import { siteConfig } from '@/lib/config/site';

export function MainNav() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

const items = [
  { label: 'Dashboard', link: '/dashboard' },
  { label: 'Transactions', link: '/transactions' },
  { label: 'Manage', link: '/manage' },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=' flex items-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  inset-x-0 border-separate h-14 md:hidden'>
      <nav className='container flex items-center justify-between px-8'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className='w-[400px] sm:w-[540px]' side='left'>
            <div className='flex text-2xl font-bold justify-center items-center gap-1'>
              <Accessibility width={32} height={32} />
              <span>{siteConfig.name}</span>
            </div>
            <div className='flex flex-col gap-1 pt-4'>
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
          <div className='flex text-2xl font-bold justify-center items-center gap-1'>
            <Accessibility width={32} height={32} />
            <span>{siteConfig.name}</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <ThemeSwitcherButton />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className=' w-full hidden h-14 inset-x-0 border-separate md:block sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-8'>
      <nav className='w-full flex items-center justify-between'>
        <div className='flex h-14 items-center  gap-x-12 w-full'>
          <div className='flex text-2xl font-bold justify-center items-center gap-1'>
            <Accessibility width={32} height={32} />
            <span>{siteConfig.name}</span>
          </div>
          <div className='flex h-full'>
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <ThemeSwitcherButton />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className='relative flex items-center'>
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-full justify-start text-lg text-muted-foreground hover:text-foreground',
          isActive && 'text-foreground'
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block' />
      )}
    </div>
  );
}
