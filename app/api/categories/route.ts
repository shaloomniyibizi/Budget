import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) redirect('/login');

  const { searchParams } = new URL(req.url);

  const paramType = searchParams.get('type');

  const validator = z.enum(['expense', 'income']).nullable();

  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const type = queryParams.data;
  const categories = await db.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include type in the filter if it is defined
    },
    orderBy: { name: 'asc' },
  });

  return Response.json(categories);
}
