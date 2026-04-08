import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Sidebar } from "../../components/core/sidebar";
import { AppHeader } from "../../components/core/header";
import { type RouteConfig } from "../../lib/routes";
import { ButtonShowcase } from "./ButtonShowcase";
import { InputShowcase } from "./InputShowcase";
import { CardShowcase } from "./CardShowcase";
import { FeedbackShowcase } from "./FeedbackShowcase";
import { DataDisplayShowcase } from "./DataDisplayShowcase";
import { OverlayShowcase } from "./OverlayShowcase";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  LogOut,
} from "lucide-react";

const showcaseRoutes: RouteConfig[] = [
  {
    label: "Dashboard",
    path: "/",
    Icon: LayoutDashboard,
    showInSidebar: true,
  },
  {
    label: "Users",
    path: "/users",
    Icon: Users,
    showInSidebar: true,
  },
  {
    label: "Documents",
    path: "/documents",
    Icon: FileText,
    showInSidebar: true,
  },
  {
    label: "Settings",
    path: "/settings",
    Icon: Settings,
    showInSidebar: true,
  },
  {
    label: "Logout",
    action: "logout",
    Icon: LogOut,
    showInSidebar: true,
  },
];

export function ShowcasePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleSubmitFeedback = async (data: { subject?: string; description?: string; images?: File[] }) => {
    console.log("Feedback submitted:", data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        onLogout={handleLogout}
        routes={showcaseRoutes}
        userName="Demo User"
        isDarkMode={isDarkMode}
        setDarkMode={setIsDarkMode}
      />
      <div className="ml-(--sidebar-collapsed-width) p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <AppHeader
              title="Component Showcase"
              onLogout={handleLogout}
              routes={showcaseRoutes}
              version="1.0.0"
              onSubmitFeedback={handleSubmitFeedback}
            />
          <p className="text-muted-foreground">
            Browse all available components in the library
          </p>
        </header>

        <Tabs defaultValue="buttons" className="w-full">
          <TabsList>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="data">Data Display</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-220px)] mt-4">
            <TabsContent value="buttons">
              <ButtonShowcase />
            </TabsContent>
            <TabsContent value="inputs">
              <InputShowcase />
            </TabsContent>
            <TabsContent value="cards">
              <CardShowcase />
            </TabsContent>
            <TabsContent value="feedback">
              <FeedbackShowcase />
            </TabsContent>
            <TabsContent value="data">
              <DataDisplayShowcase />
            </TabsContent>
            <TabsContent value="overlays">
              <OverlayShowcase />
            </TabsContent>
          </ScrollArea>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
