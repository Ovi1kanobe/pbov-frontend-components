import { Button } from "../ui/button";
import { oauthProviderIcon } from "./ProviderIcons";

type OAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: string;
  disabled?: boolean;
};

export function OAuthButton({ provider, disabled, ...props }: OAuthButtonProps) {
  const icon = oauthProviderIcon(provider);
  const label = provider.charAt(0).toUpperCase() + provider.slice(1);
  return (
    <Button type="button" className="" variant={"outline"} disabled={disabled} {...props} aria-label={label}>
      {icon ?? "error"}
      {label}
    </Button>
  );
}