import { jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { oauthProviderIcon } from "./ProviderIcons";
export function OAuthButton({ provider, disabled, ...props }) {
    const icon = oauthProviderIcon(provider);
    const label = provider.charAt(0).toUpperCase() + provider.slice(1);
    return (_jsxs(Button, { type: "button", className: "", variant: "outline", disabled: disabled, ...props, "aria-label": label, children: [icon ?? "error", label] }));
}
