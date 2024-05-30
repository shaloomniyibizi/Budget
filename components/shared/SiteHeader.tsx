import Link from 'next/link';

import { siteConfig } from '@/lib/config/site';
import { cn } from '@/lib/utils';
import { CommandMenu } from '@/components/CommandMenu';
import { MainNav } from '@/components/shared/MainNav';
import { MobileNav } from '@/components/shared/MobileNav';

import { Icons } from './Icons';
import { Button, buttonVariants } from '@/components/ui/button';
import ThemeSwitcherButton from './ThemeSwitcherButton';
import { UserButton } from '@/components/shared/UserButton';
import { currentUser } from '@/lib/utils/userAuth';

export async function Topbar() {
  const user = await currentUser();
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8'>
      <div className=' flex h-14 items-center'>
        <MainNav />
        <MobileNav />
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            <CommandMenu />
          </div>
          <nav className='flex items-center'>
            <Link
              href={siteConfig.links.github}
              target='_blank'
              rel='noreferrer'
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <Icons.gitHub className='h-4 w-4' />
                <span className='sr-only'>GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target='_blank'
              rel='noreferrer'
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <Icons.twitter className='h-3 w-3 fill-current' />
                <span className='sr-only'>Twitter</span>
              </div>
            </Link>
            <ThemeSwitcherButton />
            {user && <UserButton />}
            {!user && (
              <Button variant={'ghost'}>
                <Link href={'/login'}>Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
