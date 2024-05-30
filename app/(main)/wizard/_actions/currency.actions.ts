'use server';

import { UpdateUserCurrencySchema } from '@/lib/schemas';
import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user) {
    redirect('/login');
  }

  const userCurrency = await db.userCurrency.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });
  return userCurrency;
}
