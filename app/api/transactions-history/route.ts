import { OverviewQuerySchema } from '@/lib/schemas';
import { GetFormatterForCurrency } from '@/lib/utils';
import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/login');
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(
    user.id as string,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const userCurrency = await db.userCurrency.findUnique({
    where: {
      userId,
    },
  });
  if (!userCurrency) {
    throw new Error('user currency not found');
  }

  const formatter = GetFormatterForCurrency(userCurrency.currency as string);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    // lets format the amount with the user currency
    formattedAmount: formatter.format(transaction.amount),
  }));
}
