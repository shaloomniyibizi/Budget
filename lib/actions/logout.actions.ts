'use server';

import { signOut } from '@/lib/utils/auth';

export const logout = async () => {
  await signOut();
};
