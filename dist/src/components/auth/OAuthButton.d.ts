type OAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    provider: string;
    disabled?: boolean;
};
export declare function OAuthButton({ provider, disabled, ...props }: OAuthButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
