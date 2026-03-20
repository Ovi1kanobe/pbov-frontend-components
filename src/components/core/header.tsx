import { HelpCircle, MessageCircle } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import { Button } from "../ui/button";
import { FeedbackDialog } from "./feedback-dialog-box";
import type { RouteConfig } from "../../lib/routes";

type AppHeaderProps = {
  title: string;
  onLogout: () => void;
  routes: RouteConfig[];
  version: string;
  onSubmitFeedback: (data: { subject?: string; description?: string; images?: File[] }) => Promise<void>;
}

export function AppHeader({ title, onLogout, routes, version, onSubmitFeedback }: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  function handleRouteClick(route: RouteConfig) {
    if (route.action) {
      switch (route.action) {
        case "logout":
          onLogout();
          break;
      }
    } else if (route.path) {
      navigate(route.path);
    }
  }

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <div className="hidden md:flex flex-row gap-2 h-6 items-center text-sm text-secondary">
          {routes.map((link, idx) => (
            <Fragment key={link.path || link.label}>
              {link.action ? (
                <button
                  onClick={() => handleRouteClick(link)}
                  className="flex items-center gap-2 hover:text-gray-700 h-full transition-colors cursor-pointer"
                >
                  <p>{link.label}</p>
                  {idx !== routes.length - 1 && (
                    <div className="w-0.5 h-3/4 bg-gray-300" />
                  )}
                </button>
              ) : (
                <NavLink
                  to={link.path!}
                  className="flex items-center gap-2 hover:text-gray-700 h-full transition-colors"
                >
                  <p
                    className={
                      path === link.path ? "font-semibold text-accent" : ""
                    }
                  >
                    {link.label}
                  </p>
                  {idx !== routes.length - 1 && (
                    <div className="w-0.5 h-3/4 bg-gray-300" />
                  )}
                </NavLink>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Link to="/patch-notes" className="hidden hover:underline lg:block text-sm text-muted-foreground mr-2 hover:text-gray-700 transition-colors">
          Version: {version}
        </Link>
        <Link to="/docs" className="flex items-center flex-row">
          <Button variant={"link"} className="cursor-pointer" aria-label="Help">
            <HelpCircle />
            <p className="text-sm text-secondary">Help</p>
          </Button>
        </Link>
        <Button
          variant={"link"}
          className="cursor-pointer"
          onClick={() => setFeedbackDialogOpen(true)}
          aria-label="Feedback"
        >
          <MessageCircle />
          <p className="text-sm text-secondary">Feedback</p>
        </Button>
      </div>

      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        onSubmit={onSubmitFeedback}
      />
    </div>
  );
}