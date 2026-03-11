import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DateInput } from "../../components/ui/date-input";
import { ColorPicker } from "../../components/ui/color-picker";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function InputShowcase() {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [color, setColor] = useState("#3b82f6");
  const [date, setDate] = useState("");

  return (
    <div className="space-y-8 max-w-md">
      <Section title="Text Input">
        <div className="space-y-2">
          <Label htmlFor="default-input">Default Input</Label>
          <Input id="default-input" placeholder="Enter text..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disabled-input">Disabled Input</Label>
          <Input id="disabled-input" placeholder="Disabled" disabled />
        </div>
      </Section>

      <Section title="Input Types">
        <div className="space-y-2">
          <Label htmlFor="email-input">Email</Label>
          <Input id="email-input" type="email" placeholder="email@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-input">Password</Label>
          <Input id="password-input" type="password" placeholder="Enter password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number-input">Number</Label>
          <Input id="number-input" type="number" placeholder="0" />
        </div>
      </Section>

      <Section title="Textarea">
        <div className="space-y-2">
          <Label htmlFor="textarea">Message</Label>
          <Textarea id="textarea" placeholder="Type your message here..." />
        </div>
      </Section>

      <Section title="Select">
        <div className="space-y-2">
          <Label>Choose an option</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Checkbox">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={checked} 
            onCheckedChange={(c) => setChecked(c === true)} 
          />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </Section>

      <Section title="Switch">
        <div className="flex items-center space-x-2">
          <Switch 
            id="airplane-mode" 
            checked={switchOn} 
            onCheckedChange={setSwitchOn} 
          />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="switch-sm" size="sm" />
          <Label htmlFor="switch-sm">Small Switch</Label>
        </div>
      </Section>

      <Section title="Date Input">
        <div className="space-y-2">
          <Label>Select a date</Label>
          <DateInput value={date} onChange={setDate} />
        </div>
      </Section>

      <Section title="Color Picker">
        <div className="space-y-2">
          <Label>Pick a color</Label>
          <ColorPicker value={color} onChange={setColor} />
          <p className="text-sm text-muted-foreground">Selected: {color}</p>
        </div>
      </Section>
    </div>
  );
}
