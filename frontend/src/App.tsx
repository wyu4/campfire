import { useEffect, useState } from "react";
import Game from "./pages/Game";
import Results from "./pages/Results";
import Story from "./pages/Story";
import { Menu } from "./pages/Menu";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("Menu");
    const [results, setResults] = useState<Results | undefined>(undefined);

    const onPlay = () => {
        setCurrentPage("Story");
    };

    const onStoryFinish = () => {
        setCurrentPage("Game");
    };

    const onResults = (results: Results) => {
        setResults(results);
        setCurrentPage("Results");
    };

    return (
        <>
            {currentPage === "Menu" && <Menu onPlay={onPlay} />}{" "}
            {currentPage === "Story" && <Story onStoryEnd={onStoryFinish} />}{" "}
            {currentPage === "Game" && <Game onResults={onResults} />}{" "}
            {currentPage === "Results" && <Results {...results!} />}
        </>
    );
}

export default App;
