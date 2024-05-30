import { UserRole } from '@prisma/client';
import * as z from 'zod';
import { Currencies, MAX_DATE_RANGE_DAYS } from '../constants';
import { differenceInDays } from 'date-fns';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    username: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    onboarded: z.optional(z.boolean()),
    image: z.optional(z.string().url()),
    currency: z.optional(z.string()),
    bio: z.optional(
      z
        .string()
        .min(3, { message: 'Minimum 3 characters.' })
        .max(1000, { message: 'Maximum 1000 caracters.' })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'New password is required',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: 'Password is required',
      path: ['password'],
    }
  );

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'minimum of 6 characters required for password',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'password is required',
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'minimum of 6 characters required for password',
  }),
  name: z.string().min(3, {
    message: 'user name is required of atleast 3 character',
  }),
});

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`invalid currency: ${value}`);
    }

    return value;
  }),
});

export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal('income'), z.literal('expense')]),
});
export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;

export const categorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(['income', 'expense']),
});

export type categorySchemaType = z.infer<typeof categorySchema>;

export const OverviewQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange;
  });

export const DeleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(['income', 'expense']),
});
export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
