import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { flexRender, getSortedRowModel, getFilteredRowModel, getCoreRowModel, getPaginationRowModel, useReactTable, } from "@tanstack/react-table";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../ui/table";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
const PAGE_SIZE = 10;
export function DataTable({ columns, data, loading = false, onRowClick, }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
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
        return (_jsxs("div", { children: [_jsx("div", { className: "flex items-center py-4 px-1", children: _jsx(Input, { placeholder: "Filter users by name...", value: "", onChange: () => { }, className: "max-w-sm bg-white", disabled: true }) }), _jsx("div", { className: "overflow-hidden rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { children: headerGroup.headers.map((header) => {
                                        return (_jsx(TableHead, { children: header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext()) }, header.id));
                                    }) }, headerGroup.id))) }), _jsx(TableBody, { children: Array.from({ length: PAGE_SIZE }).map((_, i) => (_jsx(TableRow, { children: columns.map((_, colIndex) => (_jsx(TableCell, { children: _jsx(Skeleton, { className: "h-6 w-full" }) }, colIndex))) }, i))) })] }) })] }));
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "flex items-center py-4 px-1", children: _jsx(Input, { placeholder: "Filter users by name...", value: table.getColumn("name")?.getFilterValue() ?? "", onChange: (event) => table.getColumn("name")?.setFilterValue(event.target.value), className: "max-w-sm bg-white" }) }), _jsx("div", { className: "overflow-hidden rounded-md border h-[540px] flex flex-col", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { children: headerGroup.headers.map((header) => {
                                    return (_jsx(TableHead, { children: header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext()) }, header.id));
                                }) }, headerGroup.id))) }), _jsx(TableBody, { children: _jsx(AnimatePresence, { children: table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row, index) => (_jsx(motion.tr, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: {
                                        duration: 0.2,
                                        delay: index * 0.02
                                    }, "data-state": row.getIsSelected() && "selected", onClick: onRowClick ? () => onRowClick(row.original) : undefined, className: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" +
                                        (onRowClick ? " cursor-pointer" : ""), children: row.getVisibleCells().map((cell) => (_jsx(TableCell, { onClick: onRowClick && cell.column.id === "actions"
                                            ? (e) => e.stopPropagation()
                                            : undefined, children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: "No results." }) })) }) })] }) }), _jsxs("div", { className: "flex items-center justify-between space-x-2 py-4", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: (() => {
                            const totalRows = table.getFilteredRowModel().rows.length;
                            const startRow = currentPageIndex * PAGE_SIZE + 1;
                            const endRow = Math.min((currentPageIndex + 1) * PAGE_SIZE, totalRows);
                            if (totalRows === 0) {
                                return "No users found";
                            }
                            return `Showing ${startRow}-${endRow} of ${totalRows} users`;
                        })() }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPageIndex((prev) => Math.max(0, prev - 1)), disabled: currentPageIndex === 0, "aria-label": "Previous page", children: "Previous" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPageIndex((prev) => prev + 1), disabled: currentPageIndex >= Math.ceil(table.getFilteredRowModel().rows.length / PAGE_SIZE) - 1, "aria-label": "Next page", children: "Next" })] })] })] }));
}
