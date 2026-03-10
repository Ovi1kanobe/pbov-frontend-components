import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { LoginPage } from "./pages/LoginPage";
import Pocketbase from "pocketbase";
import "@/styles/globals.css";
const pb = new Pocketbase("http://127.0.0.1:8090");
function App() {
    const handleLoggedIn = (userId) => {
        console.log("Logged in:", userId);
    };
    const handleFailedLogin = (error) => {
        console.error("Login failed:", error);
    };
    return (_jsx(LoginPage, { pb: pb, userId: pb.authStore.record?.id, onLoggedIn: handleLoggedIn, onFailedLogin: handleFailedLogin }));
}
export default App;
