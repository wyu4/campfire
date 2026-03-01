import { useEffect, useState } from "react";
import Game from "./pages/Game";
import Results from "./pages/Results";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("Game");
    const [results, setResults] = useState<Results | undefined>(undefined);

    const onResults = (results: Results) => {
        setResults(results);
        setCurrentPage("Results");
    };

    return (
        <>
            {currentPage === "Game" ? (
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
