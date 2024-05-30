'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/lib/hooks/UseMediaQuery';

import { useMutation, useQuery } from '@tanstack/react-query';
import { UserCurrency } from '@prisma/client';
import SkeletonWrapper from '../cards/SkeletonWrapper';
import { UpdateUserCurrency } from '@/app/(main)/wizard/_actions/currency.actions';
import { toast } from 'sonner';
import { Currencies, Currency } from '@/lib/constants';

function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  );

  const userCurrency = useQuery<UserCurrency>({
    queryKey: ['userCurrency'],
    queryFn: () => fetch('/api/currency').then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userCurrency.data) return;
    const newCurrency = Currencies.find(
      (currency) => currency.value === userCurrency.data.currency
    );

    if (newCurrency) setSelectedOption(newCurrency);
  }, [userCurrency.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserCurrency) => {
      toast.success('Currency Updated Successfully', { id: 'update-currency' });

      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: (e) => {
      toast.error(e.message, {
        id: 'update-currency',
      });
    },
  });

  const selectionOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error('Please select a currency');
        return;
      }

      toast.loading('updating currency ...', { id: 'update-currency' });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userCurrency.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start'
              disabled={mutation.isPending}
            >
              {selectedOption ? (
                <>{selectedOption.label}</>
              ) : (
                <>+ Set currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0' align='start'>
            <OptionList setOpen={setOpen} setSelectedOption={selectionOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userCurrency.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant='outline'
            className='w-full justify-start'
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>+ Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='mt-4 border-t'>
            <OptionList setOpen={setOpen} setSelectedOption={selectionOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (currency: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder='Filter currency...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default CurrencyComboBox;
