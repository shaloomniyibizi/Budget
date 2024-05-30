import { CardWrapper } from '@/components/cards/CardWrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const AuthErrorPage = () => {
  return (
    <CardWrapper
      label='Oops! Something went wrong!'
      backHref='/login'
      backLabel='Back to login'
    >
      <div className='w-full flex justify-center items-center'>
        <ExclamationTriangleIcon className='text-destructive' />
      </div>
    </CardWrapper>
  );
};

export default AuthErrorPage;
