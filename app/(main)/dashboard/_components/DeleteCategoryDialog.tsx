import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { DeleteCategory } from '../_actions/categories.actions';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DeleteCategoryDialogProps {
  trigger: ReactNode;
  category: Category;
}
function DeleteCategoryDialog({
  category,
  trigger,
}: DeleteCategoryDialogProps) {
  const queryClient = useQueryClient();
  const categoryIdentifier = `${category.name}-${category.type}`;
  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success('Category Deleted successfuly', {
        id: categoryIdentifier,
      });

      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.success('Error while Deleting Category  ', {
        id: categoryIdentifier,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can not ne undone. This will permenently delete{' '}
            <span
              className={cn(
                category.type === 'income' ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {category.name}
            </span>{' '}
            category
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.success('Deleting Category....  ', {
                id: categoryIdentifier,
              });
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCategoryDialog;
