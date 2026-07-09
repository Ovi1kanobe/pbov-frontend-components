import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserSelectionTable } from "./user-selection-table";
export function UserRequestDialog({ open, onOpenChange, onConfirm, users, availableRoles, defaultRole, title = "Select Users", description = "Search and select users to request permissions for", className, }) {
    const [selectedUsersWithRoles, setSelectedUsersWithRoles] = React.useState([]);
    const handleConfirm = () => {
        onConfirm(selectedUsersWithRoles);
        onOpenChange(false);
        setSelectedUsersWithRoles([]);
    };
    const handleCancel = () => {
        onOpenChange(false);
        setSelectedUsersWithRoles([]);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: `max-w-2xl ${className || ""}`, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: title }), _jsx(DialogDescription, { children: description })] }), _jsx("div", { className: "py-4", children: _jsx(UserSelectionTable, { users: users, selectedUsersWithRoles: selectedUsersWithRoles, onSelectionChange: setSelectedUsersWithRoles, availableRoles: availableRoles, defaultRole: defaultRole }) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: handleCancel, children: "Cancel" }), _jsxs(Button, { onClick: handleConfirm, disabled: selectedUsersWithRoles.length === 0, children: ["Request Permissions (", selectedUsersWithRoles.length, ")"] })] })] }) }));
}
