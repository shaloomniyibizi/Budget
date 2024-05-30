import { db } from '../utils/db';

export async function getCurrencyByUserId(userId: string | undefined) {
  try {
    const currency = await db.userCurrency.findUnique({ where: { userId } });
    return currency;
  } catch {
    return null;
  }
}
