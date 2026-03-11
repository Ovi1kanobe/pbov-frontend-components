import React, { useState } from "react";
import { Progress } from "../../components/ui/progress";
import { Skeleton } from "../../components/ui/skeleton";
import { AnimatedNumber } from "../../components/ui/animated-number";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function FeedbackShowcase() {
  const [progress, setProgress] = useState(45);
  const [animatedValue, setAnimatedValue] = useState(1234);

  return (
    <div className="space-y-8 max-w-md">
      <Toaster />
      
      <Section title="Progress">
        <div className="space-y-4">
          <Progress value={progress} />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setProgress(Math.max(0, progress - 10))}
            >
              -10%
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setProgress(Math.min(100, progress + 10))}
            >
              +10%
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Current: {progress}%</p>
        </div>
      </Section>

      <Section title="Skeleton Loading">
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </Section>

      <Section title="Animated Number">
        <div className="space-y-4">
          <div className="text-4xl font-bold">
            <AnimatedNumber value={animatedValue} />
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setAnimatedValue(Math.floor(Math.random() * 10000))}
            >
              Random Value
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setAnimatedValue(animatedValue + 100)}
            >
              +100
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Toast Notifications">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast("Event has been created")}
          >
            Default Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Successfully saved!")}
          >
            Success Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Something went wrong")}
          >
            Error Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.warning("Please review your input")}
          >
            Warning Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("New update available")}
          >
            Info Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => 
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 2000)),
                {
                  loading: "Loading...",
                  success: "Data loaded!",
                  error: "Error loading data",
                }
              )
            }
          >
            Promise Toast
          </Button>
        </div>
      </Section>
    </div>
  );
}
