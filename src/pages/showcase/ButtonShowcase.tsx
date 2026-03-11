import React from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Toggle } from "../../components/ui/toggle";
import { Plus, Mail, Settings, Trash2, Bold, Italic, Underline } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3 items-center">{children}</div>
    </div>
  );
}

export function ButtonShowcase() {
  return (
    <div className="space-y-8">
      <Section title="Button Variants">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Section>

      <Section title="Button Sizes">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </Section>

      <Section title="Icon Buttons">
        <Button size="icon-xs"><Plus /></Button>
        <Button size="icon-sm"><Plus /></Button>
        <Button size="icon"><Plus /></Button>
        <Button size="icon-lg"><Plus /></Button>
      </Section>

      <Section title="Buttons with Icons">
        <Button><Mail /> Send Email</Button>
        <Button variant="outline"><Settings /> Settings</Button>
        <Button variant="destructive"><Trash2 /> Delete</Button>
      </Section>

      <Section title="Disabled State">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled Outline</Button>
        <Button variant="secondary" disabled>Disabled Secondary</Button>
      </Section>

      <Section title="Badge Variants">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </Section>

      <Section title="Toggle">
        <Toggle aria-label="Toggle bold"><Bold /></Toggle>
        <Toggle aria-label="Toggle italic"><Italic /></Toggle>
        <Toggle aria-label="Toggle underline"><Underline /></Toggle>
      </Section>
    </div>
  );
}
