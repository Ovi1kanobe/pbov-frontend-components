import {
  Lightbulb,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Separator } from"../ui/separator";
import { Toggle } from "../ui/toggle";
import { toast } from "sonner";
import { type RouteConfig } from "../../lib/routes";

type SidebarProps = {
  onLogout: () => void;
  routes: RouteConfig[];
  userName?: string;
  isDarkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  logoSrc?: string;
}

function Sidebar({ onLogout, routes, userName, isDarkMode, setDarkMode, logoSrc }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  // Use isDarkMode from context
  const lightMode = !isDarkMode;

  // Get filtered routes for sidebar based on user role

  function onToggleLightMode(pressed: boolean) {
    try {
      setDarkMode(!pressed);
    } catch {
      toast.error("Error updating dark mode preference");
    }
  }

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
    <>
      <aside
        className="
        fixed top-0 left-0 h-full
        flex flex-col
        bg-sidebar
        text-sidebar-foreground
        transition-all duration-500
        w-(--sidebar-collapsed-width)
        hover:w-(--sidebar-width)
        z-50 group rounded-r-3xl pt-20 items-center
      "
      >
        <div className="flex flex-col items-center p-4 rounded-xl transition-all duration-300">
          <img src={logoSrc} alt="Logo" className="w-8 h-8 group-hover:w-12 group-hover:h-12  shrink-0 transition-all duration-400" />
          <div className="text-center flex flex-col gap-1 items-center">
            <p className="mt-2 text-xl opacity-0 font-special font-semibold group-hover:opacity-100 transition-opacity duration-300 text-nowrap">
              <span className="text-sidebar-accent font-bold text-2xl">C</span>ircuit{" "}
              <span className="text-sidebar-accent font-bold text-2xl">C</span>entral
            </p>
            <p className="mt-0 text-md opacity-0 italic text-sidebar-foreground group-hover:opacity-100 transition-opacity duration-300 text-nowrap">
              Court Reporting Application
            </p>
            <p className="mt-2 text-sm opacity-0 text-sidebar-accent group-hover:opacity-100 transition-opacity duration-300 text-nowrap">
              {userName || "Guest"}
            </p>
          </div>
        </div>
        <div className="flex flex-row w-full justify-center items-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Toggle aria-label="Toggle light/dark mode" className="data-[state=on]:bg-sidebar-accent" pressed={lightMode} onPressedChange={onToggleLightMode}>
            <Lightbulb />
          </Toggle>
        </div>
        <Separator className="group-hover:opacity-100 opacity-0 transition-opacity duration-500 mb-10" />
        <nav className="flex flex-col w-full items-left justify-start relative">
          {routes.map((route) => {
            const { Icon, label, sidebarLabel, path: linkPath, action } = route;
            const isActive = linkPath && path === linkPath;
            
            if (action) {
              return (
                <button
                  key={label}
                  onClick={() => handleRouteClick(route)}
                  className="flex flex-row hover:text-sidebar-accent/60 justify-start ml-4 group-hover:translate-x-12 p-2 rounded-xl items-center transition-all duration-400 cursor-pointer"
                  aria-label={sidebarLabel || label}
                >
                  <div className="flex flex-row">
                    {Icon && <Icon className="w-6 h-6" />}
                    <span className="opacity-0 text-nowrap group-hover:block transition-opacity duration-500 ml-4 group-hover:opacity-100">
                      {sidebarLabel || label}
                    </span>
                  </div>
                </button>
              );
            }
            
            return (
              <NavLink
                key={label}
                to={linkPath!}
                className="flex flex-row hover:text-sidebar-accent/60 justify-start ml-4 group-hover:translate-x-12 p-2 rounded-xl items-center transition-all duration-400"
                aria-label={`Navigate to ${sidebarLabel || label}`}
              >
                <div className="flex flex-row">
                  {Icon && (
                    <Icon
                      className={`w-6 h-6 ${isActive ? "text-sidebar-accent" : ""}`}
                    />
                  )}
                  <span
                    className={`
                    opacity-0 text-nowrap group-hover:block
                    transition-opacity duration-500 ml-4 group-hover:opacity-100
                    ${isActive ? "text-sidebar-accent" : ""}
                  `}
                  >
                    {sidebarLabel || label}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div
        className="fixed top-0 left-0 h-full
        bg-none hidden
        text-sidebar-foreground
        transition-all duration-500
        w-(--sidebar-collapsed-width)
        hover:w-(--sidebar-width)
        z-50 group rounded-r-3xl pt-20 group items-center"
      ></div>
    </>
  );
}

export default Sidebar;