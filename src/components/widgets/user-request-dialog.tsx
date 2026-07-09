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
import { UserSelectionTable } from "./user-selection-table"

interface UserRequestDialogProps<T extends { id: string; email: string }> {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (selectedUsers: T[]) => void
  users: T[]
  title?: string
  description?: string
}

export function UserRequestDialog<T extends { id: string; email: string }>({
  open,
  onOpenChange,
  onConfirm,
  users,
  title = "Select Users",
  description = "Search and select users to request permissions for",
}: UserRequestDialogProps<T>) {
  const [selectedUsers, setSelectedUsers] = React.useState<T[]>([])

  const handleConfirm = () => {
    onConfirm(selectedUsers)
    onOpenChange(false)
    setSelectedUsers([])
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedUsers([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UserSelectionTable
            users={users}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedUsers.length === 0}
          >
            Request Permissions ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}