declare type Surveillance = {
    name: string;
    camera_number: number;
    latitude: number;
    longitude: number;
};

declare type SurveillanceHook = {
    src: string;
    getDistance: (guess: number[]) => number;
    answer: number[];
    status: number;
};
