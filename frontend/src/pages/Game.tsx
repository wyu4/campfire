import { useEffect, useRef, useState } from "react";
import useSurveillance from "../hooks/Surveillance";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import { OttawaBounds, WorldBounds } from "../utils/CoordinateUtils";
import "./../style/Game.scss";
import PushButton from "../components/PushButton";

const markerIcon = L.icon({
    iconUrl: "/Marker.webp",
    iconSize: [100, 100],
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

export default function Game() {
    const { src, setGuess, status }: SurveillanceHook = useSurveillance(0);
    const markerPosition = useRef<LatLngExpression | undefined>(undefined);
    const resetMap = useRef<() => void>(() => {});

    const onClick = (latlng: number[]) => {
        if (latlng.length < 2) return;
        markerPosition.current = latlng as LatLngExpression;
    };
    const onResetFunctionDefined = (resetFunction: () => void) => {
        resetMap.current = resetFunction;
    };

    // useEffect(() => {
    //     console.log(`New data: ${src}, ${status}`);
    // }, [src, distance, status]);

    useEffect(() => {
        
    }, [status]);

    return (
        <div className="game">
            <div className="feed-panel">
                {src !== "" ? <img className="feed" src={src} /> : null}
            </div>
            <div className="map-container">
                <MapContainer
                    className="map"
                    attributionControl={false}
                    maxBounds={WorldBounds}
                >
                    <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
                    <MapController onClick={onClick} onReset={onResetFunctionDefined} />
                </MapContainer>
                <PushButton onClick={resetMap.current}>Reset</PushButton>
                {/* <PushButton onClick={}>Set Pin</PushButton> */}
            </div>
        </div>
    );
}
