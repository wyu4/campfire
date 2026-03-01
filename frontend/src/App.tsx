import { useEffect, useState } from "react";
import Game from "./pages/Game";
import Results from "./pages/Results";
import Story from "./pages/Story";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("Story");
    const [results, setResults] = useState<Results | undefined>(undefined);

    const onStoryFinish = () => {
        setCurrentPage("Game");
    };

    const onResults = (results: Results) => {
        setResults(results);
        setCurrentPage("Results");
    };

    return (
        <>
            {currentPage === "Story" ? (
                <Story onStoryEnd={onStoryFinish} />
            ) : currentPage === "Game" ? (
                <Game onResults={onResults} />
            ) : currentPage === "Results" ? (
                <Results
                    answer={results!.answer}
                    guess={results!.guess}
                    won={results!.won}
                />
            ) : null}
        </>
    );
}

export default App;
