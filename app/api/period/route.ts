import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/login');
  }

  const periods = await getHistoryPeriods(user.id as string);
  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await db.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ['year'],
    orderBy: [
      {
        year: 'asc',
      },
    ],
  });

  const years = result.map((el) => el.year);
  if (years.length === 0) {
    // Return the current year
    return [new Date().getFullYear()];
  }

  return years;
}
