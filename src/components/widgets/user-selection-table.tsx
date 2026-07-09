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

interface UserSelectionTableProps<T extends { id: string; email: string }> {
  users: T[]
  selectedUsers: T[]
  onSelectionChange: (selectedUsers: T[]) => void
}

export function UserSelectionTable<T extends { id: string; email: string }>({
  users,
  selectedUsers,
  onSelectionChange,
}: UserSelectionTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // filter users based on search - only show results when at least 2 chars typed
  // Always show selected users regardless of search
  const filteredUsers = React.useMemo(() => {
    if (searchQuery.length < 2) {
      // Show selected users even when no search
      return selectedUsers
    }

    const query = searchQuery.toLowerCase()
    const matchingUsers = users.filter((user) => {
      const email = user.email?.toLowerCase() || ""
      return email.includes(query)
    })

    // Combine selected users with search results, avoiding duplicates
    const selectedIds = new Set(selectedUsers.map(u => u.id))

    // Add selected users first, then matching non-selected users
    const combined = [...selectedUsers]
    matchingUsers.forEach(user => {
      if (!selectedIds.has(user.id)) {
        combined.push(user)
      }
    })

    return combined
  }, [users, searchQuery, selectedUsers])

  const isUserSelected = (user: T) => {
    return selectedUsers.some((u) => u.id === user.id)
  }

  const toggleUserSelection = (user: T) => {
    if (isUserSelected(user)) {
      onSelectionChange(selectedUsers.filter((u) => u.id !== user.id))
    } else {
      onSelectionChange([...selectedUsers, user])
    }
  }

  const toggleSelectAll = () => {
    const allFiltered = filteredUsers.every((user) => isUserSelected(user))
    if (allFiltered) {
      // deselect all filtered users
      const filteredIds = new Set(filteredUsers.map((u) => u.id))
      onSelectionChange(selectedUsers.filter((u) => !filteredIds.has(u.id)))
    } else {
      // select all filtered users
      const newSelection = [...selectedUsers]
      filteredUsers.forEach((user) => {
        if (!isUserSelected(user)) {
          newSelection.push(user)
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
      {(searchQuery.length >= 2 || selectedUsers.length > 0) && (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {searchQuery.length > 0 && searchQuery.length < 2 && selectedUsers.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  )
}