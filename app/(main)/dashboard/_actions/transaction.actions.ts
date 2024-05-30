'use server';

import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/lib/schemas';
import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';

export async function CreateTranstion(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await currentUser();

  if (!user) redirect('/login');

  const { amount, category, date, description, type } = parsedBody.data;

  const categoryRow = await db.category.findFirst({
    where: { userId: user.id, name: category },
  });

  if (!categoryRow) throw new Error('Category Not Found');

  await db.$transaction([
    //create user transaction
    db.transaction.create({
      data: {
        userId: user.id as string,
        amount,
        date,
        description: description || '',
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // update month aggregate table
    db.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id as string,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id as string,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),

    // update year aggregate table
    db.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id as string,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id as string,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
  ]);
}
