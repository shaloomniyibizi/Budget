import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/utils/userAuth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await currentUser();
  if (user) redirect('/dashboard');
  return (
    <main className='flex min-h-full flex-col items-center justify-between p-24'>
      <Button asChild>
        <Link href={'/login'}>Login</Link>
      </Button>
    </main>
  );
}
