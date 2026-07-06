import Pocketbase from "pocketbase";
export interface UserPreferencesUser {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    created?: string;
    avatar?: string;
    collectionName?: string;
    collectionId?: string;
}
export interface UserPreferencesSectionProps {
    /** The currently logged-in user, or null when not authenticated. */
    user: UserPreferencesUser | null;
    pb: Pocketbase;
    /** Persist a new avatar for the user. */
    updateUser: (data: {
        avatar: File;
    }) => void;
    /** Current preferences record; only the color is read here. */
    preferences: {
        color?: string;
    } | null;
    /** Persist changed preferences (debounced color updates land here). */
    updatePreferences: (data: {
        color?: string;
    }) => void | Promise<void>;
    isDarkMode: boolean;
    setDarkMode: (isDarkMode: boolean) => void;
    availableThemes: {
        label: string;
        value: string;
    }[];
    theme: string;
    setTheme: (theme: string) => void;
    /** Optional error handler; defaults to a toast. */
    onError?: (message: string) => void;
}
export declare function UserPreferencesSection({ user, pb, updateUser, preferences, updatePreferences, isDarkMode, setDarkMode, availableThemes, theme, setTheme, onError, }: UserPreferencesSectionProps): import("react").JSX.Element;
