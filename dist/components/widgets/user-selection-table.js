import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
export function UserSelectionTable({ users, selectedUsersWithRoles, onSelectionChange, availableRoles = {}, defaultRole = Object.keys(availableRoles)[0] || "user", }) {
    const [searchQuery, setSearchQuery] = React.useState("");
    // filter users based on search - only show results when at least 2 chars typed
    // Always show selected users regardless of search
    const filteredUsers = React.useMemo(() => {
        const selectedUsersList = selectedUsersWithRoles.map(item => item.user);
        if (searchQuery.length < 2) {
            // Show selected users even when no search
            return selectedUsersList;
        }
        const query = searchQuery.toLowerCase();
        const matchingUsers = users.filter((user) => {
            const email = user.email?.toLowerCase() || "";
            return email.includes(query);
        });
        // Combine selected users with search results, avoiding duplicates
        const selectedIds = new Set(selectedUsersList.map(u => u.id));
        // Add selected users first, then matching non-selected users
        const combined = [...selectedUsersList];
        matchingUsers.forEach(user => {
            if (!selectedIds.has(user.id)) {
                combined.push(user);
            }
        });
        return combined;
    }, [users, searchQuery, selectedUsersWithRoles]);
    const isUserSelected = (user) => {
        return selectedUsersWithRoles.some((item) => item.user.id === user.id);
    };
    const getUserRole = (user) => {
        const found = selectedUsersWithRoles.find((item) => item.user.id === user.id);
        return found?.role || defaultRole;
    };
    const toggleUserSelection = (user) => {
        if (isUserSelected(user)) {
            onSelectionChange(selectedUsersWithRoles.filter((item) => item.user.id !== user.id));
        }
        else {
            onSelectionChange([...selectedUsersWithRoles, { user, role: defaultRole }]);
        }
    };
    const updateUserRole = (user, role) => {
        const updated = selectedUsersWithRoles.map((item) => item.user.id === user.id ? { ...item, role } : item);
        onSelectionChange(updated);
    };
    const toggleSelectAll = () => {
        const allFiltered = filteredUsers.every((user) => isUserSelected(user));
        if (allFiltered) {
            // deselect all filtered users
            const filteredIds = new Set(filteredUsers.map((u) => u.id));
            onSelectionChange(selectedUsersWithRoles.filter((item) => !filteredIds.has(item.user.id)));
        }
        else {
            // select all filtered users
            const newSelection = [...selectedUsersWithRoles];
            filteredUsers.forEach((user) => {
                if (!isUserSelected(user)) {
                    newSelection.push({ user, role: defaultRole });
                }
            });
            onSelectionChange(newSelection);
        }
    };
    const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((user) => isUserSelected(user));
    return (_jsxs("div", { className: "flex flex-col space-y-4", children: [_jsx(Input, { placeholder: "Search by email (type at least 2 characters)...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), (searchQuery.length >= 2 || selectedUsersWithRoles.length > 0) && (_jsx("div", { className: "border rounded-md", children: _jsx("div", { className: "max-h-[300px] overflow-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { className: "sticky top-0 bg-background border-b", children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-10 px-2", children: _jsx(Checkbox, { checked: allFilteredSelected, onCheckedChange: toggleSelectAll }) }), _jsx(TableHead, { className: "min-w-0", children: "Email" }), Object.keys(availableRoles).length > 0 && (_jsx(TableHead, { className: "w-32", children: "Role" }))] }) }), _jsx(TableBody, { children: filteredUsers.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: Object.keys(availableRoles).length > 0 ? 3 : 2, className: "text-center text-muted-foreground", children: "No users found matching your search" }) })) : (filteredUsers.map((user) => (_jsxs(TableRow, { className: "cursor-pointer", onClick: () => toggleUserSelection(user), children: [_jsx(TableCell, { className: "px-2", onClick: (e) => e.stopPropagation(), children: _jsx(Checkbox, { checked: isUserSelected(user), onCheckedChange: () => toggleUserSelection(user) }) }), _jsx(TableCell, { className: "truncate min-w-0 max-w-[200px]", children: user.email }), Object.keys(availableRoles).length > 0 && (_jsx(TableCell, { className: "w-32", onClick: (e) => e.stopPropagation(), children: _jsxs(Select, { value: isUserSelected(user) ? getUserRole(user) : defaultRole, onValueChange: (value) => {
                                                    if (!isUserSelected(user)) {
                                                        // Auto-select user when changing role
                                                        onSelectionChange([...selectedUsersWithRoles, { user, role: value }]);
                                                    }
                                                    else {
                                                        updateUserRole(user, value);
                                                    }
                                                }, disabled: !isUserSelected(user), children: [_jsx(SelectTrigger, { className: "w-full", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: Object.entries(availableRoles).map(([key, value]) => (_jsx(SelectItem, { value: key, children: value }, key))) })] }) }))] }, user.id)))) })] }) }) })), searchQuery.length > 0 && searchQuery.length < 2 && selectedUsersWithRoles.length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Type at least 2 characters to search" }))] }));
}
