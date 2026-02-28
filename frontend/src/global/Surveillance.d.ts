declare type Surveillance = {
    name: string;
    camera_number: number;
    latitude: number;
    longitude: number;
};

declare type SurveillanceHook = {
    src: string;
    distance: number | undefined;
    setGuess: (number) => void;
    status: number;
};
