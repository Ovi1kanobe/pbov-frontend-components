import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { MoreHorizontal } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export function CardShowcase() {
  return (
    <div className="space-y-8">
      <Section title="Basic Cards">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is some card content. Cards are versatile components for displaying grouped information.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Learn More</Button>
          </CardFooter>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Small Card</CardTitle>
            <CardDescription>Compact card variant</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Smaller padding and sizing for tight layouts.</p>
          </CardContent>
        </Card>
      </Section>

      <Section title="Cards with Actions">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Last updated 2 hours ago</CardDescription>
            <CardAction>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge>Active</Badge>
              <Badge variant="outline">v2.1.0</Badge>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost">Cancel</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages</CardDescription>
            <CardAction>
              <Badge variant="destructive">3</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Click to view your notifications and manage your preferences.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View All</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Content Cards">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Invite and manage your team</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>John Doe</span>
                <Badge variant="secondary">Admin</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Jane Smith</span>
                <Badge variant="outline">Member</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Bob Wilson</span>
                <Badge variant="outline">Member</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Invite Member</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your performance this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold">567</p>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
