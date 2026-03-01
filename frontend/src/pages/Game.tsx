import { useEffect, useRef, useState } from "react";
import useSurveillance from "../hooks/Surveillance";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import { OttawaBounds, WorldBounds } from "../utils/CoordinateUtils";
import "./../style/Game.scss";
import PushButton from "../components/PushButton";

const winAccuracy = 4; // In KILOMETERS

const markerIcon = L.icon({
    iconUrl: "/Marker.webp",
    iconSize: [150, 150],
});

function MapController({ onClick, onReset }: GameMapContainer) {
    const map = useMap();
    const [selection, setSelection] = useState<LatLngExpression | undefined>(
        undefined,
    );
    useEffect(() => {
        const onMapClick = (event: L.LeafletMouseEvent) => {
            const lat = Math.max(-90, Math.min(90, event.latlng.lat));
            const lng = Math.max(-180, Math.min(180, event.latlng.lng));
            onClick([lat, lng]);
            setSelection([lat, lng]);
        };
        map.on("click", onMapClick);

        return () => {
            map.off("click", onMapClick);
        };
    }, [map, onClick]);

    useEffect(() => {
        if (selection === undefined) return;
        const marker = L.marker(selection, {
            icon: markerIcon,
        }).addTo(map);
        return () => {
            map.removeLayer(marker);
        };
    }, [map, selection]);

    useEffect(() => {
        const moveToOttawa = () => map.fitBounds(OttawaBounds);
        onReset(moveToOttawa);
        moveToOttawa();
    }, [map]);
    return null;
}

export default function Game({ onResults }: Game) {
    const { src, getDistance, answer, status }: SurveillanceHook =
        useSurveillance(0);
    const [markerPosition, setMarkerPosition] = useState<
        LatLngExpression | undefined
    >(undefined);
    const resetMap = useRef<() => void>(() => {});
    const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
    const [triesLeft, setTriesLeft] = useState(5);

    const onClick = (latlng: number[]) => {
        if (latlng.length < 2) return;
        setMarkerPosition(latlng as LatLngExpression);
    };
    const onResetFunctionDefined = (resetFunction: () => void) => {
        resetMap.current = resetFunction;
    };

    useEffect(() => {
        if (markerPosition === undefined) return;
        setTriesLeft((prev) => prev - 1);
        setAccuracy(getDistance(markerPosition as number[]));
    }, [markerPosition]);

    useEffect(() => {
        if (markerPosition === undefined) return;
        const won = getDistance(markerPosition as number[]) <= winAccuracy;

        if (triesLeft > 0 && !won) return;

        onResults({
            guess: markerPosition as number[],
            answer: answer,
            won: won,
        });
    }, [triesLeft, markerPosition, answer]);

    return (
        <div className="game">
            <div className="feed-panel">
                {src !== "" ? <img className="feed" src={src} /> : null}
            </div>
            <div className="game-data">
                <p>
                    {accuracy === undefined
                        ? "Place a marker to start"
                        : `Accuracy: ${accuracy.toPrecision(2)}km`}
                </p>
                <p>{`Tries Left: ${triesLeft}`}</p>
            </div>
            <MapContainer
                className="map"
                attributionControl={false}
                maxBounds={WorldBounds}
                doubleClickZoom={false}
            >
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController
                    onClick={onClick}
                    onReset={onResetFunctionDefined}
                />
            </MapContainer>
            <PushButton className="reset" onClick={resetMap.current}><img src="/ResetButton.webp" /></PushButton>
            <img className="image" src="/ComputerBackground.webp" />
        </div>
    );
}
