import { useEffect, useRef, useState } from "react";
import Game from "./pages/Game";
import Results from "./pages/Results";
import Story, { StoryEnd } from "./pages/Story";
import { Menu } from "./pages/Menu";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("Menu");
    const [results, setResults] = useState<Results | undefined>(undefined);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current === null) return;
        if (currentPage === "Menu") {
            audioRef.current.pause();
        } else {
            audioRef.current
                .play()
                .catch((err) => `Could not play audio: ${err}`);
        }
    }, [audioRef, currentPage]);

    return (
        <div className="app">
            <audio ref={audioRef} loop>
                <source
                    src="/crafty-crime-jonny-boyle-main-version-02-38-14.mp3"
                    type="audio/mpeg"
                />
            </audio>
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
