import SettingsForm from '@/components/forms/SettingsForm';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getUserById } from '@/lib/data/user';
import { currentUser } from '@/lib/utils/userAuth';
import { redirect } from 'next/navigation';

const SettingsPage = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await getUserById(user?.id as string);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const userData = {
    name: userInfo?.name || '',
    username: userInfo?.username || '',
    email: userInfo?.email || '',
    bio: userInfo?.bio || '',
    password: '',
    newPassword: '',
    image: userInfo?.image || '',
    role: user?.role,
    isTwoFactorEnabled: user?.isTwoFactorEnabled,
  };
  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <SettingsForm user={userData} btnTitle='Update' />
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
