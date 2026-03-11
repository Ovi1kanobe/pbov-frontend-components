import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { ShowcasePage } from "./pages/showcase";
import Pocketbase from "pocketbase";
import "@/styles/globals.css";

const pb = new Pocketbase("http://127.0.0.1:8090");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoggedIn = (userId: string) => {
    console.log("Logged in:", userId);
    setIsLoggedIn(true);
  };

  const handleFailedLogin = (error: unknown) => {
    console.error("Login failed:", error);
    // Still show showcase even on failed login for demo purposes
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <ShowcasePage />;
  }

  return (
    <LoginPage
      pb={pb}
      userId={pb.authStore.record?.id}
      onLoggedIn={handleLoggedIn}
      onFailedLogin={handleFailedLogin}
    />
  );
}

export default App;
