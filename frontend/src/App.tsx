import { useEffect, useState } from "react";
import Game from "./pages/Game";
import Results from "./pages/Results";
import Story, { StoryEnd } from "./pages/Story";
import { Menu } from "./pages/Menu";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("Menu");
    const [results, setResults] = useState<Results | undefined>(undefined);

    return (
        <div className="app">
            {currentPage === "Menu" && (
                <Menu onPlay={() => setCurrentPage("Story")} />
            )}{" "}
            {currentPage === "Story" && (
                <Story
                    onStoryEnd={() => {
                        setResults(undefined);
                        setCurrentPage("Game");
                    }}
                />
            )}{" "}
            {currentPage === "Game" && (
                <Game
                    onResults={(data) => {
                        setResults(data);
                        setCurrentPage("End");
                    }}
                />
            )}{" "}
            {currentPage === "End" && (
                <StoryEnd
                    onStoryEnd={() => setCurrentPage("Results")}
                    won={results!.won}
                />
            )}{" "}
            {currentPage === "Results" && (
                <Results
                    {...results!}
                    onLeave={(leaveType) => {
                        if (leaveType === "Home") {
                            setCurrentPage("Menu");
                        } else {
                            setResults(undefined);
                            setCurrentPage("Game");
                        }
                    }}
                />
            )}
        </div>
    );
}

export default App;
