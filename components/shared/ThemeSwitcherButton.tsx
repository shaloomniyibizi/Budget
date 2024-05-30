'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

const ThemeSwitcherButton = () => {
  const { theme, setTheme: localSetTheme } = useTheme();
  const [light, setLight] = useState(theme === 'dark');

  useEffect(() => {
    setLight(theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localSetTheme(newTheme);
    setLight(newTheme === 'light');
  };

  return (
    <Button variant='ghost' className='w-9 px-0' onClick={toggleTheme}>
      {light ? (
        <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      ) : (
        <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      )}
    </Button>
  );
};

export default ThemeSwitcherButton;
