'use server';

import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';

export async function DeleteTransaction(id: string) {
  const user = await currentUser();

  if (!user) redirect('/login');

  const transaction = await db.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) throw new Error('Bad request');

  await db.$transaction([
    //Delete transaction from db

    db.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),

    // update month history
    db.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id as string,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),

    // update year history
    db.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id as string,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
