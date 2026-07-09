import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { UserSelectionTable, type UserWithRole } from "./user-selection-table"

interface UserRequestDialogProps<T extends { id: string; email: string }> {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (selectedUsersWithRoles: UserWithRole<T>[]) => void
  users: T[]
  availableRoles?: Record<string, string>
  defaultRole?: string
  title?: string
  description?: string
}

export function UserRequestDialog<T extends { id: string; email: string }>({
  open,
  onOpenChange,
  onConfirm,
  users,
  availableRoles,
  defaultRole,
  title = "Select Users",
  description = "Search and select users to request permissions for",
}: UserRequestDialogProps<T>) {
  const [selectedUsersWithRoles, setSelectedUsersWithRoles] = React.useState<UserWithRole<T>[]>([])

  const handleConfirm = () => {
    onConfirm(selectedUsersWithRoles)
    onOpenChange(false)
    setSelectedUsersWithRoles([])
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedUsersWithRoles([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UserSelectionTable
            users={users}
            selectedUsersWithRoles={selectedUsersWithRoles}
            onSelectionChange={setSelectedUsersWithRoles}
            availableRoles={availableRoles}
            defaultRole={defaultRole}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedUsersWithRoles.length === 0}
          >
            Request Permissions ({selectedUsersWithRoles.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}