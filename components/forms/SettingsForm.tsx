'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { usePathname, useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/utils/uploadthing';
import { SettingsSchema } from '@/lib/schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';
import { Switch } from '@/components/ui/switch';
import { BeatLoader } from 'react-spinners';
import { settings } from '@/lib/actions/settings.actions';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { isBase64Image } from '@/lib/utils';
import { toast } from 'sonner';
import { FormError } from './FormError';
import { ImageIcon } from 'lucide-react';

interface Props {
  user: {
    name: string;
    username: string;
    email: string;
    bio: string;
    image: string;
    password?: string;
    newPassword?: string;
    role?: UserRole;
    isTwoFactorEnabled?: boolean;
  };
  btnTitle: string;
}

const SettingsForm = ({ user, btnTitle }: Props) => {
  const currentUser = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing('media');

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user.name || undefined,
      username: user?.username || undefined,
      email: user?.email || undefined,
      bio: user?.bio || undefined,
      image: user?.image || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || 'USER',
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      onboarded: true,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(async () => {
      const blob = values.image as string;
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url;
        }
      }
      console.log(values);

      settings(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            setError(data.error);
          }

          if (data.success) {
            update();
            router.refresh();
            toast.success(data.success);
            if (pathname === '/settings') {
              router.back();
            } else {
              router.push('/wizard');
            }
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem className='flex items-center gap-4 justify-center'>
                <FormLabel>
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt='profile_icon'
                      width={96}
                      height={96}
                      priority
                      className='rounded-full object-contain w-28 h-28'
                    />
                  ) : (
                    <ImageIcon />
                  )}
                </FormLabel>
                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                  <Input
                    type='file'
                    accept='image/*'
                    placeholder='Eddit profile image'
                    className=''
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {pathname === '/settings' && (
            <>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='John Doe '
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='John' disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {pathname === '/settings' && (
            <>
              {currentUser?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='john.doe@example.com'
                          type='email'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    className='account-form_input no-focus'
                    {...field}
                    placeholder='Tell us a little about yourself'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {pathname === '/settings' && (
            <>
              {currentUser?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='******'
                            type='password'
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='******'
                            type='password'
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {currentUser?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name='isTwoFactorEnabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
        </div>
        <FormError message={error} />
        <Button disabled={isPending} type='submit' className='w-full'>
          {isPending ? <BeatLoader /> : btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default SettingsForm;
