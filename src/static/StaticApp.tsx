import { useState } from "react";
import StaticBoardPage from "./StaticBoardPage";
import StaticAuthPage from "./StaticAuthPage";

/**
 * StaticApp:
 * The entry point for the "Demo Mode" of FlowBoard.
 * It bypasses all authentication and database logic to provide 
 * an instant, interactive preview.
 */
const StaticApp = () => {
    /* Simple state to track if the demo user is "logged in" */
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {isLoggedIn ? (
                <StaticBoardPage onSignOut={handleLogout} />
            ) : (
                <StaticAuthPage onLogin={handleLogin} />
            )}
        </div>
    );
};

export default StaticApp;

