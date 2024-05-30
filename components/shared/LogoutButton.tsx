'use client';

import { logout } from '@/lib/actions/logout.actions';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    logout();
    router.refresh();
  };

  return (
    <span onClick={onClick} className='cursor-pointer'>
      {children}
    </span>
  );
};
