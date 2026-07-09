import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  type SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { Plus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  onRequestUsers?: (rows: TData[]) => void;
}

const PAGE_SIZE = 10;

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onRowClick,
  onRequestUsers,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: currentPageIndex,
        pageSize: PAGE_SIZE,
      },
    },
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPageIndex(0);
  }, [columnFilters]);

  if (loading) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-4 py-4 px-1">
        <Input
          placeholder="Filter users by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="min-w-60 flex-1 bg-white"
        />
        <Button className="w-fit shrink-0"><Plus /> Request New</Button>
      </div>
        <div className="overflow-hidden rounded-md border">
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
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-wrap items-center gap-4 py-4 px-1">
        <Input
          placeholder="Filter users by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="min-w-60 flex-1 bg-white"
        />
        <Button
          className="w-fit shrink-0"
          onClick={() => onRequestUsers && onRequestUsers(table.getSelectedRowModel().rows.map(row => row.original))}
        >
          <Plus /> Request New
        </Button>
      </div>
    <div className="overflow-hidden rounded-md border h-135 flex flex-col">
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
          <AnimatePresence>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.02
                  }}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={
                    "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" +
                    (onRowClick ? " cursor-pointer" : "")
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={
                        onRowClick && cell.column.id === "actions"
                          ? (e) => e.stopPropagation()
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        {(() => {
          const totalRows = table.getFilteredRowModel().rows.length;
          const startRow = currentPageIndex * PAGE_SIZE + 1;
          const endRow = Math.min((currentPageIndex + 1) * PAGE_SIZE, totalRows);

          if (totalRows === 0) {
            return "No users found";
          }

          return `Showing ${startRow}-${endRow} of ${totalRows} users`;
        })()}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentPageIndex === 0}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPageIndex((prev) => prev + 1)}
          disabled={currentPageIndex >= Math.ceil(table.getFilteredRowModel().rows.length / PAGE_SIZE) - 1}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
    </div>
  );
}
