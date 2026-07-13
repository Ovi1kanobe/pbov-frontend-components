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
    /**
     * When set, the user's identity (name, email, role, avatar) is managed by
     * the parent ccfw app: the avatar upload is replaced with a link to edit
     * the profile there. Build the value from useParentLinkInfo — pass null on
     * the parent app or while the link is down to keep local avatar editing.
     */
    profileManagedBy?: {
        url: string;
        label?: string;
    } | null;
}
export declare function UserPreferencesSection({ user, pb, updateUser, preferences, updatePreferences, isDarkMode, setDarkMode, availableThemes, theme, setTheme, onError, profileManagedBy, }: UserPreferencesSectionProps): import("react").JSX.Element;
