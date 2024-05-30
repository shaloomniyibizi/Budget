import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  let userCurrency = await db.userCurrency.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userCurrency) {
    userCurrency = await db.userCurrency.create({
      data: {
        userId: user.id as string,
        currency: 'RWF',
      },
    });
  }

  // Revalidate the home page that uses the user currency
  revalidatePath('/');
  return Response.json(userCurrency);
}
