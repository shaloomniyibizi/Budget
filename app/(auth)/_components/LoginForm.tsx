'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/schemas';
import { z } from 'zod';
import { login } from '@/lib/actions/login.actions';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { FormError } from '@/components/forms/FormError';
import { FormSuccess } from '@/components/forms/FormSuccess';
import { BeatLoader } from 'react-spinners';
import { Social } from '@/components/shared/Social';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isRegister?: boolean;
}

export function LoginForm({ isRegister, className, ...props }: LoginFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [showTwoFactor, setShowTwoFactor] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLoginSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            router.refresh();
            update();
            toast.success(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError('Something went wrong'));
    });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLoginSubmit)}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='sr-only' htmlFor='name'>
                        Two Factor Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id='twofactor'
                          placeholder='123456'
                          type='number'
                          autoCapitalize='none'
                          autoComplete='twofactor'
                          autoCorrect='off'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='sr-only' htmlFor='email'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id='email'
                            type='email'
                            autoCapitalize='none'
                            autoComplete='email'
                            autoCorrect='off'
                            placeholder='john.doe@example.com'
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='sr-only' htmlFor='password'>
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id='password'
                            placeholder='********'
                            type='password'
                            autoCapitalize='none'
                            autoComplete='password'
                            autoCorrect='off'
                            disabled={isPending}
                          />
                        </FormControl>
                        <Button
                          size='sm'
                          variant='link'
                          asChild
                          className='px-0 font-normal'
                        >
                          <Link href='/reset'>Forgot password?</Link>
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type='submit' className='w-full'>
              {showTwoFactor ? (
                <>{isPending ? <BeatLoader /> : 'Confirm'}</>
              ) : (
                <>{isPending ? <BeatLoader /> : 'Login'}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>
      <Social />
    </div>
  );
}
