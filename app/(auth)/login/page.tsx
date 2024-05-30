import { Metadata } from 'next';
import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Accessibility } from 'lucide-react';
import { LoginForm } from '../_components/LoginForm';
import { RegisterForm } from '../_components/RegisterForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login forms built using the components.',
};

export default function LoginPage() {
  return (
    <>
      <div className='container relative h-[calc(100vh-3.6rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <Accessibility />
            Budget Buddy
          </div>
          <div className='relative z-20 mt-8'>
            <blockquote className='space-y-2 relative'>
              <p className='text-lg text-justify'>
                Our Budget Buddy simplifies money management with its quick
                register and login forms. Sign up to personalize your budgeting
                journey, then easily access your financial data to stay on top
                of your spending. Efficient and secure, Budget Buddy makes
                financial management a breeze.
              </p>
              <footer className='absolute w-fit text-sm text-muted-foreground mr-auto right-0'>
                Shaloom Niyibizi
              </footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <Tabs defaultValue='login' className='w-[400px]'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='login'>Login</TabsTrigger>
                <TabsTrigger value='register'>Register</TabsTrigger>
              </TabsList>
              <TabsContent value='login'>
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      this form provides a secure gateway for users to access
                      their financial data and track their spending habits
                      effortlessly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='space-y-1'>
                      <LoginForm />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className='px-8 text-center text-sm text-muted-foreground'>
                      By clicking continue, you agree to our{' '}
                      <Link
                        href='/terms'
                        className='underline underline-offset-4 hover:text-primary'
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href='/privacy'
                        className='underline underline-offset-4 hover:text-primary'
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value='register'>
                <Card>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                      This collecting essential details to personalize your
                      budgeting experience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='space-y-1'>
                      <RegisterForm />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className='px-8 text-center text-sm text-muted-foreground'>
                      By clicking continue, you agree to our{' '}
                      <Link
                        href='/terms'
                        className='underline underline-offset-4 hover:text-primary'
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href='/privacy'
                        className='underline underline-offset-4 hover:text-primary'
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
