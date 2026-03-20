type UserColorSelectionWidgetProps = {
    currentColor: string;
    setCurrentColor: (currentColor: string) => void;
    onError: (errorMessage: string) => void;
};
export declare function UserColorSelectionWidget({ currentColor, setCurrentColor, onError }: UserColorSelectionWidgetProps): import("react/jsx-runtime").JSX.Element;
export {};
