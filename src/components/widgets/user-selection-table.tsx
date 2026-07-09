import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export interface UserWithRole<T extends { id: string; email: string }> {
  user: T
  role: string
}

interface UserSelectionTableProps<T extends { id: string; email: string }> {
  users: T[]
  selectedUsersWithRoles: UserWithRole<T>[]
  onSelectionChange: (selectedUsersWithRoles: UserWithRole<T>[]) => void
  availableRoles?: Record<string, string> // e.g., { "user": "user", "manager": "manager", "administrator": "administrator" }
  defaultRole?: string
}

export function UserSelectionTable<T extends { id: string; email: string }>({
  users,
  selectedUsersWithRoles,
  onSelectionChange,
  availableRoles = {},
  defaultRole = Object.keys(availableRoles)[0] || "user",
}: UserSelectionTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // filter users based on search - only show results when at least 2 chars typed
  // Always show selected users regardless of search
  const filteredUsers = React.useMemo(() => {
    const selectedUsersList = selectedUsersWithRoles.map(item => item.user)

    if (searchQuery.length < 2) {
      // Show selected users even when no search
      return selectedUsersList
    }

    const query = searchQuery.toLowerCase()
    const matchingUsers = users.filter((user) => {
      const email = user.email?.toLowerCase() || ""
      return email.includes(query)
    })

    // Combine selected users with search results, avoiding duplicates
    const selectedIds = new Set(selectedUsersList.map(u => u.id))

    // Add selected users first, then matching non-selected users
    const combined = [...selectedUsersList]
    matchingUsers.forEach(user => {
      if (!selectedIds.has(user.id)) {
        combined.push(user)
      }
    })

    return combined
  }, [users, searchQuery, selectedUsersWithRoles])

  const isUserSelected = (user: T) => {
    return selectedUsersWithRoles.some((item) => item.user.id === user.id)
  }

  const getUserRole = (user: T) => {
    const found = selectedUsersWithRoles.find((item) => item.user.id === user.id)
    return found?.role || defaultRole
  }

  const toggleUserSelection = (user: T) => {
    if (isUserSelected(user)) {
      onSelectionChange(selectedUsersWithRoles.filter((item) => item.user.id !== user.id))
    } else {
      onSelectionChange([...selectedUsersWithRoles, { user, role: defaultRole }])
    }
  }

  const updateUserRole = (user: T, role: string) => {
    const updated = selectedUsersWithRoles.map((item) =>
      item.user.id === user.id ? { ...item, role } : item
    )
    onSelectionChange(updated)
  }

  const toggleSelectAll = () => {
    const allFiltered = filteredUsers.every((user) => isUserSelected(user))
    if (allFiltered) {
      // deselect all filtered users
      const filteredIds = new Set(filteredUsers.map((u) => u.id))
      onSelectionChange(selectedUsersWithRoles.filter((item) => !filteredIds.has(item.user.id)))
    } else {
      // select all filtered users
      const newSelection = [...selectedUsersWithRoles]
      filteredUsers.forEach((user) => {
        if (!isUserSelected(user)) {
          newSelection.push({ user, role: defaultRole })
        }
      })
      onSelectionChange(newSelection)
    }
  }

  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((user) => isUserSelected(user))

  return (
    <div className="w-full">
      <Input
        placeholder="Search by email (type at least 2 characters)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {(searchQuery.length >= 2 || selectedUsersWithRoles.length > 0) && (
        <div className="border rounded-md max-h-100 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                {Object.keys(availableRoles).length > 0 && (
                  <TableHead>Role</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={Object.keys(availableRoles).length > 0 ? 3 : 2} className="text-center text-muted-foreground">
                    No users found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => toggleUserSelection(user)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isUserSelected(user)}
                        onCheckedChange={() => toggleUserSelection(user)}
                      />
                    </TableCell>
                    <TableCell className="truncate">{user.email}</TableCell>
                    {Object.keys(availableRoles).length > 0 && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {isUserSelected(user) ? (
                          <Select
                            value={getUserRole(user)}
                            onValueChange={(value) => updateUserRole(user, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(availableRoles).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {searchQuery.length > 0 && searchQuery.length < 2 && selectedUsersWithRoles.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  )
}