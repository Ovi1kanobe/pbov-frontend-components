type ThemeSelectionWidgetProps = {
    availableThemes: {
        label: string;
        value: string;
    }[];
    theme: string;
    setTheme: (theme: string) => void;
};
export declare function ThemeSelectionWidget({ availableThemes, theme, setTheme }: ThemeSelectionWidgetProps): import("react/jsx-runtime").JSX.Element;
export {};
