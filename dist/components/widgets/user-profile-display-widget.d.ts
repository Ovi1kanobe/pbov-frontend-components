type UserProfileDisplayWidgetProps = {
    user: {
        id: string;
        name?: string;
        email?: string;
        role?: string;
        created?: string;
        avatar?: string;
    };
    pb: any;
};
export declare function UserProfileDisplayWidget({ user, pb }: UserProfileDisplayWidgetProps): import("react/jsx-runtime").JSX.Element;
export {};
