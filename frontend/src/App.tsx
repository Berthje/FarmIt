import React from "react";
import { LoadingScreen } from "./components/LoadingScreen";

const App: React.FC = () => {
  return (
    <LoadingScreen>
      <div className="min-h-screen bg-green-800">
        <div className="text-center p-4 text-white">
          <h1 className="text-4xl">Welcome to FarmIt</h1>
          <p>Your farming adventure begins!</p>
        </div>
      </div>
    </LoadingScreen>
  );
};

export default App;
