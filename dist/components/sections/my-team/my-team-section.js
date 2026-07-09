import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from "react";
import {} from "@tanstack/react-table";
import Pocketbase from "pocketbase";
import { ArrowUpDown, Users } from "lucide-react";
import { Button } from "../../ui/button";
import { UserAvatar } from "../../core/user-avatar";
import { SettingsWidget } from "../../core/settings-widget";
import { DataTable } from "./data-table";
function getTeamColumns(pb, renderActions) {
    const columns = [
        {
            accessorKey: "avatar",
            header: "Avatar",
            cell: ({ row }) => (_jsx("div", { className: "flex items-center", children: _jsx(UserAvatar, { user: row.original, className: "w-8 h-8 rounded-full", pb: pb }) })),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), "aria-label": "Sort by email", children: ["Email", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), "aria-label": "Sort by name", children: ["Name", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
        },
        {
            accessorKey: "role",
            header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), "aria-label": "Sort by role", children: ["Access Level", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
            cell: ({ row }) => (_jsx("span", { className: "capitalize", children: row.original.role || "No Access" })),
        },
        {
            accessorKey: "inactive",
            header: ({ column }) => (_jsxs(Button, { variant: "ghost", onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), "aria-label": "Sort by status", children: ["Status", _jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" })] })),
            cell: ({ row }) => (_jsx("span", { className: row.original.inactive ? "text-destructive" : "text-green-600", children: row.original.inactive ? "Inactive" : "Active" })),
        },
    ];
    if (renderActions) {
        columns.push({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => renderActions(row.original),
            enableSorting: false,
        });
    }
    return columns;
}
export function MyTeamSection({ users, pb, loading, renderActions, title = "My Team Management", description = "View and manage team members under your supervision", onRequestUsers, }) {
    return (_jsx("div", { className: "space-y-6", children: _jsx(SettingsWidget, { title: title, description: description, icon: _jsx(Users, { size: 18 }), children: _jsx("div", { className: "space-y-4", children: _jsx("div", { className: "h-full w-full", children: _jsx(DataTable, { columns: getTeamColumns(pb, renderActions), data: users, loading: loading, onRequestUsers: onRequestUsers }) }) }) }) }));
}
