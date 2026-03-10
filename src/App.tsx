import React from "react";
import { LoginPage } from "./pages/LoginPage";
import Pocketbase from "pocketbase";
import "@/styles/globals.css";

const pb = new Pocketbase("http://127.0.0.1:8090");

function App() {
  const handleLoggedIn = (userId: string) => {
    console.log("Logged in:", userId);
  };

  const handleFailedLogin = (error: unknown) => {
    console.error("Login failed:", error);
  };

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
