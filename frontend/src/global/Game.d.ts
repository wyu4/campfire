declare type GameMapContainer = {
    onClick: (latlng: number[]) => void;
    onReset: (resetFunc: () => void) => void;
};
