import "@/components/auth/starfield.css";
import Pocketbase from "pocketbase";
import type PocketBaseError from "../lib/pberror";
type LoginProps = {
    pb: Pocketbase;
    userId: string | undefined;
    onLoggedIn: (userId: string) => void;
    onFailedLogin: (error: PocketBaseError) => void;
    logoSrc?: string;
};
export declare function LoginPage({ pb, userId, onLoggedIn, onFailedLogin, logoSrc }: LoginProps): import("react/jsx-runtime").JSX.Element;
export {};
