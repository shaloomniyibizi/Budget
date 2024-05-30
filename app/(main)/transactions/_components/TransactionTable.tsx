'use client';

import { GetTransactionHistoryResponseType } from '@/app/api/transactions-history/route';
import SkeletonWrapper from '@/components/cards/SkeletonWrapper';
import { DataTableColumnHeader } from '@/components/shared/datatable/ColumnHeader';
import { ColumnToggle } from '@/components/shared/datatable/ColumnToggle';
import { DataTableFacetedFilter } from '@/components/shared/datatable/FacetedFilter';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, dateToUTCDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Download, MoreHorizontal, TrashIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteTransactionDialog from './DeleteTransactionDialog';

interface TransactionTableProps {
  from: Date;
  to: Date;
}

const emptyData: any[] = [];

type TransactionHistoryRow = GetTransactionHistoryResponseType[0];

const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className='flex gap-2 capitalize'>
        {row.original.categoryIcon}
        <div className='capitalize'>{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <div className='flex gap-2 capitalize'>{row.original.description}</div>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formatedDate = date.toLocaleDateString('default', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return <div className='flex gap-2 capitalize'>{formatedDate}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          'capitalize rounded-lg text-center p-2',
          row.original.type === 'income' &&
            'bg-emerald-400/10 text-emerald-500',
          row.original.type === 'expense' && 'bg-red-400/10 text-red-500'
        )}
      >
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => (
      <p className='rounded-lg bg-gray-400/5 p-2 text-center font-medium'>
        {row.original.formattedAmount}
      </p>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

function TransactionTable({ from, to }: TransactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const history = useQuery<GetTransactionHistoryResponseType>({
    queryKey: ['transactions', 'history', from, to],
    queryFn: () =>
      fetch(
        `/api/transactions-history?from=${dateToUTCDate(
          from
        )}&to=${dateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    history.data?.forEach((transaction) => {
      categoriesMap.set(transaction.category, {
        value: transaction.category,
        label: `${transaction.categoryIcon} ${transaction.category}`,
      });
    });
    const uniquCategories = new Set(categoriesMap.values());
    return Array.from(uniquCategories);
  }, [history.data]);

  const typesOptions = useMemo(() => {
    const typesMap = new Map();
    history.data?.forEach((transaction) => {
      typesMap.set(transaction.type, {
        value: transaction.type,
        label: transaction.type,
      });
    });
    const uniquTypes = new Set(typesMap.values());
    return Array.from(uniquTypes);
  }, [history.data]);

  return (
    <div className='w-full px-8'>
      <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
        <div className='flex gap-2'>
          <SkeletonWrapper isLoading={history.isFetching} fullWidth={false}>
            {table.getColumn('category') && (
              <DataTableFacetedFilter
                options={categoriesOptions}
                title='Category'
                column={table.getColumn('category')}
              />
            )}
          </SkeletonWrapper>
          <SkeletonWrapper isLoading={history.isFetching} fullWidth={false}>
            {table.getColumn('type') && (
              <DataTableFacetedFilter
                options={typesOptions}
                title='Type'
                column={table.getColumn('type')}
              />
            )}
          </SkeletonWrapper>
        </div>
        <div className='flex flex-wrap gap-2'>
          <SkeletonWrapper isLoading={history.isFetching} fullWidth={false}>
            <ColumnToggle table={table} />
          </SkeletonWrapper>
          <SkeletonWrapper isLoading={history.isFetching} fullWidth={false}>
            <Button
              variant={'outline'}
              size={'sm'}
              className='ml-auto h-8 lg:flex'
              onClick={() => {
                const data = table.getFilteredRowModel().rows.map((row) => ({
                  NO: row.original.id,
                  'CATEGORY ICON': row.original.categoryIcon,
                  CATEGORY: row.original.category,
                  DESCRIPTION: row.original.description,
                  TYPE: row.original.type,
                  AMOUNT: row.original.amount,
                  'FORMATED AMOUNT': row.original.formattedAmount,
                  DATE: row.original.date,
                }));
                handleExportCSV(data);
              }}
            >
              <Download className='mr-2 h-4 w-4' /> Export CSV
            </Button>
          </SkeletonWrapper>
        </div>
      </div>
      <SkeletonWrapper isLoading={history.isFetching}>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
}

export default TransactionTable;

function RowActions({ transaction }: { transaction: TransactionHistoryRow }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        transactionId={transaction.id}
      />
      <DropdownMenu>
        <div
          className='flex
        items-center
        justify-center
        w-full'
        >
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='w-8 h-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='flex items-center gap-2'
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon className='w-4 h-4 text-muted-foreground text-red-500' />{' '}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
