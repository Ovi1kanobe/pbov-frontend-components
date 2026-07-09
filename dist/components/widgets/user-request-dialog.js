import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserSelectionTable } from "./user-selection-table";
export function UserRequestDialog({ open, onOpenChange, onConfirm, users, title = "Select Users", description = "Search and select users to request permissions for", }) {
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const handleConfirm = () => {
        onConfirm(selectedUsers);
        onOpenChange(false);
        setSelectedUsers([]);
    };
    const handleCancel = () => {
        onOpenChange(false);
        setSelectedUsers([]);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-3xl max-h-[80vh]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: title }), _jsx(DialogDescription, { children: description })] }), _jsx("div", { className: "py-4", children: _jsx(UserSelectionTable, { users: users, selectedUsers: selectedUsers, onSelectionChange: setSelectedUsers }) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: handleCancel, children: "Cancel" }), _jsxs(Button, { onClick: handleConfirm, disabled: selectedUsers.length === 0, children: ["Request Permissions (", selectedUsers.length, ")"] })] })] }) }));
}
