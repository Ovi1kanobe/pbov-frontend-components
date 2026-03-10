import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import type { AuthMethodsList } from "pocketbase";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { Button } from "@/components/ui/button";
import "@/components/auth/starfield.css";
import AuthBackground from "@/components/auth/AuthBackground";
import Pocketbase from "pocketbase";
import type PocketBaseError from "@/lib/pberror";

function AuthInput({
  type,
  id,
  value,
  onChange,
  placeholder,
  required,
}: {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col w-full h-10 relative">
      <div className="bg-input rounded-md w-full h-10 relative z-10">
        <input
          className="w-full h-full rounded-md text-md px-4 relative z-10"
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          style={{ outline: "none", boxShadow: "none", background: "none" }}
          placeholder={placeholder}
        />
      </div>
      <div className="absolute w-full h-full bg-accent-foreground/10 bottom-0 left-0 z-0 translate-y-0.5 rounded-lg" />
    </div>
  );
}

type LoginProps = {
  pb: Pocketbase
  userId: string | undefined
  onLoggedIn: (userId: string) => void
  onFailedLogin: (error: PocketBaseError) => void
  logoSrc?: string
}

export function LoginPage({
  pb,
  userId,
  onLoggedIn,
  onFailedLogin,
  logoSrc
}: LoginProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [authMethods, setAuthMethods] = React.useState<
    AuthMethodsList | undefined
  >(undefined);

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

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
      try {
      const res = await pb.collection("users").authWithPassword(
        username,
        password
      );
      setLoggedIn(true);
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        onLoggedIn(res.record.id);
      });
    } catch (error) {
      onFailedLogin(error as PocketBaseError);
    }
  }

  const handleOAuth = async (provider: string) => {
    const res = await pb.collection("users").authWithOAuth2({
      provider,
    });
    setLoggedIn(true);
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
      onLoggedIn(res.record.id);
    });
  };

  return (
    <main
      className={cn(
        "w-screen h-screen relative flex items-center justify-center bg-white transition-opacity duration-700",
        loggedIn ? "opacity-0" : "opacity-100"
      )}
    >
      <AuthBackground />
      <div 
        className={cn(
          "bg-card p-6 rounded-4xl shadow-md w-96 z-30 transition-all duration-600 ease-in-out",
          "scale-100 opacity-100"
        )}
      >
        {logoSrc && <img src={logoSrc} alt="Logo" className="w-40 mx-auto mb-4" />}
        <p className="text-muted-foreground text-center text-lg">
          Unified Data for Court Reporting
        </p>
        <form
          onSubmit={handleLogin}
          className="mt-8 w-full px-4 py-2 flex flex-col gap-4 justify-center items-center"
        >
          <AuthInput
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter Username"
          />
          <AuthInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter Password"
          />
          <Button type="submit" className="p-4" variant={"default"} aria-label="Sign in with Email">
            Sign in with Email
          </Button>
        </form>
        {authMethods?.oauth2?.providers?.map((provider) => {
          return (
            <>
              <div className="items-center justify-center mb-4 text-xs text-gray-500">
                <Separator className="mb-1 mt-4" />
                <p className="text-center">OR CONTINUE WITH</p>
                <Separator className="mt-1" />
              </div>
              <OAuthButton
                key={provider.name}
                className="w-full"
                provider={provider.name}
                onClick={() => handleOAuth(provider.name)}
              />
            </>
          );
        })}
      </div>
    </main>
  );
}