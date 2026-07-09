import { type ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import Pocketbase from "pocketbase";
import { ArrowUpDown, Users } from "lucide-react";
import { Button } from "../../ui/button";
import { UserAvatar } from "../../core/user-avatar";
import { SettingsWidget } from "../../core/settings-widget";
import { DataTable } from "./data-table";

export interface TeamMember {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  inactive?: boolean;
  avatar?: string;
  collectionId?: string;
  collectionName?: string;
}

function getTeamColumns(
  pb: Pocketbase,
  renderActions?: (user: TeamMember) => ReactNode,
): ColumnDef<TeamMember>[] {
  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <div className="flex items-center">
          <UserAvatar user={row.original} className="w-8 h-8 rounded-full" pb={pb} />
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by email"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by name"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by role"
        >
          Access Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role || "No Access"}</span>
      ),
    },
    {
      accessorKey: "inactive",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by status"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className={row.original.inactive ? "text-destructive" : "text-green-600"}>
          {row.original.inactive ? "Inactive" : "Active"}
        </span>
      ),
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

export interface MyTeamSectionProps {
  users: TeamMember[];
  pb: Pocketbase;
  loading?: boolean;
  /** Per-row actions menu. App supplies its own (roles, impersonation, etc.). */
  renderActions?: (user: TeamMember) => ReactNode;
  title?: string;
  description?: string;
  onRequestUsers?: (users: TeamMember[]) => void;
}

export function MyTeamSection({
  users,
  pb,
  loading,
  renderActions,
  title = "My Team Management",
  description = "View and manage team members under your supervision",
  onRequestUsers,
}: MyTeamSectionProps) {
  return (
    <div className="space-y-6">
      <SettingsWidget title={title} description={description} icon={<Users size={18} />}>
        <div className="space-y-4">
          <div className="h-full w-full">
            <DataTable
              columns={getTeamColumns(pb, renderActions)}
              data={users}
              loading={loading}
              onRequestUsers={onRequestUsers}
            />
          </div>
        </div>
      </SettingsWidget>
    </div>
  );
}
