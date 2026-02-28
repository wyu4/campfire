import { useState } from "react";
import Game from "./pages/Game";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("Game");
    return <>{currentPage === "Game" ? <Game /> : null}</>;
}

export default App;
