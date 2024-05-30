'use server';

import {
  DeleteCategorySchema,
  DeleteCategorySchemaType,
  categorySchema,
  categorySchemaType,
} from '@/lib/schemas';
import { db } from '@/lib/utils/db';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';

export async function CreateCategory(form: categorySchemaType) {
  const parsedBody = categorySchema.safeParse(form);

  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await currentUser();

  if (!user) redirect('/login');

  const { name, icon, type } = parsedBody.data;

  return await db.category.create({
    data: {
      userId: user.id as string,
      name,
      icon,
      type,
    },
  });
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);

  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await currentUser();

  if (!user) redirect('/login');

  const { name, type } = parsedBody.data;

  return await db.category.delete({
    where: {
      name_userId_type: {
        userId: user.id as string,
        name,
        type,
      },
    },
  });
}
