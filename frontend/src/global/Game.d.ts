declare type GameMapContainer = {
    onClick: (latlng: number[]) => void;
    onReset: (resetFunc: () => void) => void;
};

declare type Game = {
    onResults: (data: Results) => void;
};
