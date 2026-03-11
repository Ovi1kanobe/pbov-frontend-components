import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ButtonShowcase } from "./ButtonShowcase";
import { InputShowcase } from "./InputShowcase";
import { CardShowcase } from "./CardShowcase";
import { FeedbackShowcase } from "./FeedbackShowcase";
import { DataDisplayShowcase } from "./DataDisplayShowcase";
import { OverlayShowcase } from "./OverlayShowcase";

export function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Component Showcase</h1>
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
  );
}
