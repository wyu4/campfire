declare type ResultsMapController = {
    guess: number[] | undefined;
    answer: number[];
};

declare type Results = {
    guess: number[] | undefined;
    answer: number[];
    won: boolean;
};

declare type LeaveType = "Home" | "Retry" | "None";
