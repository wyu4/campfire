declare type Surveillance = {
    name: string;
    camera_number: number;
    latitude: number;
    longitude: number;
};

declare type SurveillanceHook = {
    src: string;
    setGuess: (guess: number[]) => number;
    status: number;
};
