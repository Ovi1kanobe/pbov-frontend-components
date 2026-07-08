import { type ColumnDef } from "@tanstack/react-table";
import React from "react";
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
    onRowClick?: (row: TData) => void;
}
export declare function DataTable<TData, TValue>({ columns, data, loading, onRowClick, }: DataTableProps<TData, TValue>): React.JSX.Element;
export {};
