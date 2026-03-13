import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DateInput } from "../../components/ui/date-input";
import { ColorPicker } from "../../components/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Button } from "../../components/ui/button";
import { RecordSelector } from "../../components/core/record-selector";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

type User = {
  id: string;
  name: string;
  email: string;
};

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com" },
  { id: "4", name: "Diana Prince", email: "diana@example.com" },
  { id: "5", name: "Eve Wilson", email: "eve@example.com" },
];

export function InputShowcase() {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [color, setColor] = useState("#3b82f6");
  const [date, setDate] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

      <Section title="Combobox (Popover + Command)">
        <div className="space-y-2">
          <Label>Select a framework</Label>
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="w-full justify-between"
              >
                {comboboxValue
                  ? frameworks.find((framework) => framework.value === comboboxValue)?.label
                  : "Select framework..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setComboboxValue(currentValue === comboboxValue ? "" : currentValue);
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            comboboxValue === framework.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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

      <Section title="Record Selector">
        <div className="space-y-2 w-100">
          <Label>Select a user</Label>
          <RecordSelector
            data={sampleUsers}
            value={selectedUser}
            setValue={setSelectedUser}
            label={(user) => user.name}
            identifier={(user) => user.id}
            placeholder="Select a user..."
            className="w-100"
          />
          {selectedUser && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedUser.name} ({selectedUser.email})
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
