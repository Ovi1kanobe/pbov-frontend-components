import { Fragment, useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export interface UserAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  hidden?: boolean;
  /** Render a separator immediately above this item. */
  separatorBefore?: boolean;
}

interface UserActionsProps {
  actions: UserAction[];
  /** Header shown at the top of the menu. */
  menuLabel?: ReactNode;
  disabled?: boolean;
}

export function UserActions({ actions, menuLabel = "Actions", disabled = false }: UserActionsProps) {
  const [isRunning, setIsRunning] = useState(false);

  const visible = actions.filter((action) => !action.hidden);
  if (!visible.length) return null;

  // async handlers disable the whole menu while in flight; sync ones just fire
  const run = async (action: UserAction) => {
    const result = action.onClick();
    if (result instanceof Promise) {
      setIsRunning(true);
      try {
        await result;
      } finally {
        setIsRunning(false);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={disabled || isRunning}
          aria-label="Open user actions menu"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visible.map((action, i) => (
          <Fragment key={i}>
            {action.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => run(action)}
              disabled={disabled || isRunning || action.disabled}
            >
              {action.icon && <span className="mr-2 inline-flex">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
