import React, { ReactNode } from 'react';

function layout({ children }: { children: ReactNode }) {
  return (
    <div className='relative flex flex-col items-center justify-center w-full h-full'>
      {children}
    </div>
  );
}

export default layout;
