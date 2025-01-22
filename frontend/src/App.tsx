import React from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { GameHUD } from "./components/hud/GameHUD";
import { MapRenderer } from "./components/map/MapRenderer";

const App: React.FC = () => {
    const playerData = {
        username: "TestPlayer",
        level: 1,
        xp: 50,
        maxXp: 100,
        coins: 1000,
    };

    return (
        <LoadingScreen>
            <div className="min-h-screen bg-black">
                <MapRenderer/>
                <GameHUD playerData={playerData} />
            </div>
        </LoadingScreen>
    );
};

export default App;
