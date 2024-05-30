import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getUserById } from '@/lib/data/user';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/utils/userAuth';
import SettingsForm from '@/components/forms/SettingsForm';
import { revalidatePath } from 'next/cache';

const OnboardingPage = async () => {
  const user = await currentUser();

  if (!user) redirect('/login');

  const userInfo = await getUserById(user?.id as string);

  if (userInfo?.onboarded) {
    revalidatePath('/dashboard');
    redirect('/dashboard');
  }

  const userData = {
    name: userInfo?.name || '',
    username: userInfo?.username || '',
    email: userInfo?.email || '',
    bio: userInfo?.bio || '',
    image: userInfo?.image || '',
  };

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>⚙️ Onboarding</p>
      </CardHeader>
      <CardContent>
        <SettingsForm user={userData} btnTitle='Continue' />
      </CardContent>
    </Card>
  );
};

export default OnboardingPage;
