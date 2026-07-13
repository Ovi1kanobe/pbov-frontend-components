import { useState, useEffect } from "react";
import { ExternalLink, User } from "lucide-react";
import Pocketbase from "pocketbase";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { SettingsWidget } from "../core/settings-widget";
import { DarkModeSelectionWidget } from "../widgets/dark-mode-selection-widget";
import { ThemeSelectionWidget } from "../widgets/theme-selection-widget";
import { UserAvatarUploadWidget } from "../widgets/user-avatar-upload-widget";
import { UserColorSelectionWidget } from "../widgets/user-color-selection-widget";
import { UserProfileDisplayWidget } from "../widgets/user-profile-display-widget";
import { useDebounce } from "../../hooks/useDebounce";

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
  updateUser: (data: { avatar: File }) => void;
  /** Current preferences record; only the color is read here. */
  preferences: { color?: string } | null;
  /** Persist changed preferences (debounced color updates land here). */
  updatePreferences: (data: { color?: string }) => void | Promise<void>;
  isDarkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
  availableThemes: { label: string; value: string }[];
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
  profileManagedBy?: { url: string; label?: string } | null;
}

export function UserPreferencesSection({
  user,
  pb,
  updateUser,
  preferences,
  updatePreferences,
  isDarkMode,
  setDarkMode,
  availableThemes,
  theme,
  setTheme,
  onError,
  profileManagedBy,
}: UserPreferencesSectionProps) {
  const handleError = onError ?? ((message: string) => toast.error(message));

  // local color state, debounced so dragging the picker doesn't spam updatePreferences
  const [localColor, setLocalColor] = useState(preferences?.color || "#000000");
  const debouncedColor = useDebounce(localColor, 300);

  // sync local state when preferences change from outside
  useEffect(() => {
    if (preferences?.color && preferences.color !== localColor) {
      setLocalColor(preferences.color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences?.color]);

  // push the debounced color once it settles
  useEffect(() => {
    if (debouncedColor && debouncedColor !== preferences?.color) {
      updatePreferences({ color: debouncedColor });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedColor]);

  if (!user) {
    return (
      <SettingsWidget
        title="User Preferences"
        description="Please log in to view and edit your preferences."
        icon={<User size={18} />}
      >
        <p className="text-sm text-muted-foreground">
          You need to be logged in to access your preferences.
        </p>
      </SettingsWidget>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfileDisplayWidget user={user} pb={pb} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profileManagedBy ? (
          <ManagedProfileWidget
            url={profileManagedBy.url}
            label={profileManagedBy.label}
          />
        ) : (
          <UserAvatarUploadWidget user={user} pb={pb} updateUser={updateUser} />
        )}

        <UserColorSelectionWidget
          currentColor={localColor}
          setCurrentColor={setLocalColor}
          onError={handleError}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThemeSelectionWidget
          theme={theme}
          setTheme={setTheme}
          availableThemes={availableThemes}
        />

        <DarkModeSelectionWidget isDarkMode={isDarkMode} setDarkMode={setDarkMode} />
      </div>
    </div>
  );
}

// Shown in place of the avatar upload when the profile is synced from the
// parent app — same pattern as Microsoft 365 apps linking out to the account
// page instead of editing the profile in-place.
function ManagedProfileWidget({ url, label }: { url: string; label?: string }) {
  const appLabel = label ?? "CCFW";
  return (
    <SettingsWidget
      title="Profile"
      description={`Your name, email, role, and avatar are managed centrally in ${appLabel}.`}
      icon={<User size={18} />}
    >
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Changes made there sync to this app automatically.
        </p>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={12} />
            Edit profile on {appLabel}
          </a>
        </Button>
      </div>
    </SettingsWidget>
  );
}
