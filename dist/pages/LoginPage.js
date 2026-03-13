import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { cn } from "../lib/utils";
import { Separator } from "../components/ui/separator";
import { OAuthButton } from "../components/auth/OAuthButton";
import { Button } from "../components/ui/button";
import { AuthBackground } from "../components/auth/AuthBackground";
import Pocketbase from "pocketbase";
function AuthInput({ type, id, value, onChange, placeholder, required, }) {
    return (_jsxs("div", { className: "flex flex-col w-full h-10 relative", children: [_jsx("div", { className: "bg-input rounded-md w-full h-10 relative z-10", children: _jsx("input", { className: "w-full h-full rounded-md text-md px-4 relative z-10", type: type, id: id, value: value, onChange: onChange, required: required, style: { outline: "none", boxShadow: "none", background: "none" }, placeholder: placeholder }) }), _jsx("div", { className: "absolute w-full h-full bg-accent-foreground/10 bottom-0 left-0 z-0 translate-y-0.5 rounded-lg" })] }));
}
export function LoginPage({ pb, userId, onLoggedIn, onFailedLogin, logoSrc }) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [authMethods, setAuthMethods] = React.useState(undefined);
    useEffect(() => {
        const fetchAuthMethods = async () => {
            if (userId) {
                onLoggedIn(userId);
                return;
            }
            const res = await pb.collection("users").listAuthMethods();
            setAuthMethods(res);
        };
        fetchAuthMethods();
    }, [pb, onLoggedIn, userId]);
    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await pb.collection("users").authWithPassword(username, password);
            setLoggedIn(true);
            new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                onLoggedIn(res.record.id);
            });
        }
        catch (error) {
            onFailedLogin(error);
        }
    }
    const handleOAuth = async (provider) => {
        const res = await pb.collection("users").authWithOAuth2({
            provider,
        });
        setLoggedIn(true);
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            onLoggedIn(res.record.id);
        });
    };
    return (_jsxs("main", { className: cn("w-screen h-screen relative flex items-center justify-center bg-white transition-opacity duration-700", loggedIn ? "opacity-0" : "opacity-100"), children: [_jsx(AuthBackground, {}), _jsxs("div", { className: cn("bg-card p-6 rounded-4xl shadow-md w-96 z-30 transition-all duration-600 ease-in-out", "scale-100 opacity-100"), children: [logoSrc && _jsx("img", { src: logoSrc, alt: "Logo", className: "w-40 mx-auto mb-4" }), _jsx("p", { className: "text-muted-foreground text-center text-lg", children: "Unified Data for Court Reporting" }), _jsxs("form", { onSubmit: handleLogin, className: "mt-8 w-full px-4 py-2 flex flex-col gap-4 justify-center items-center", children: [_jsx(AuthInput, { type: "text", id: "username", value: username, onChange: (e) => setUsername(e.target.value), required: true, placeholder: "Enter Username" }), _jsx(AuthInput, { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "Enter Password" }), _jsx(Button, { type: "submit", className: "p-4", variant: "default", "aria-label": "Sign in with Email", children: "Sign in with Email" })] }), authMethods?.oauth2?.providers?.map((provider) => {
                        return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "items-center justify-center mb-4 text-xs text-gray-500", children: [_jsx(Separator, { className: "mb-1 mt-4" }), _jsx("p", { className: "text-center", children: "OR CONTINUE WITH" }), _jsx(Separator, { className: "mt-1" })] }), _jsx(OAuthButton, { className: "w-full", provider: provider.name, onClick: () => handleOAuth(provider.name) }, provider.name)] }));
                    })] })] }));
}
