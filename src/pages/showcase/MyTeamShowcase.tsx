import React from "react";
import { MyTeamSection, type TeamMember } from "../../components/sections/my-team/my-team-section";
import Pocketbase from "pocketbase";

// Mock PocketBase instance for demo
const pb = new Pocketbase("http://127.0.0.1:8090");

// Mock data for demonstration
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    inactive: false,
    avatar: "",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "editor",
    inactive: false,
    avatar: "",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "viewer",
    inactive: true,
    avatar: "",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "admin",
    inactive: false,
    avatar: "",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "editor",
    inactive: false,
    avatar: "",
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "viewer",
    inactive: false,
    avatar: "",
  },
  {
    id: "7",
    name: "Eve Taylor",
    email: "eve.taylor@example.com",
    role: "admin",
    inactive: true,
    avatar: "",
  },
  {
    id: "8",
    name: "Frank Castle",
    email: "frank.castle@example.com",
    role: "editor",
    inactive: false,
    avatar: "",
  },
];

export function MyTeamShowcase() {
  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Team Section</h2>
        <p className="text-muted-foreground mb-6">
          A comprehensive team management component with search, sorting, pagination, and custom actions.
        </p>
      </div>

      <MyTeamSection
        users={mockTeamMembers}
        pb={pb}
        loading={false}
        title="Team Members"
        description="Manage your team members and their access levels"
        renderActions={(user) => (
          <div className="flex gap-2">
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => console.log('Edit user:', user)}
            >
              Edit
            </button>
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => console.log('View user:', user)}
            >
              View
            </button>
          </div>
        )}
      />
    </div>
  );
}