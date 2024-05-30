import { redirect } from 'next/navigation';
import { currentUser } from '../utils/userAuth';
import { db } from '../utils/db';
import { revalidatePath } from 'next/cache';

export async function addCurrency() {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  try {
    let currency = await db.userCurrency.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!currency) {
      currency = await db.userCurrency.create({
        data: {
          userId: user.id as string,
          currency: 'USD',
        },
      });
    }

    // Revalidate the home page that uses the user currency
    revalidatePath('/');

    return currency;
  } catch {
    return null;
  }
}
