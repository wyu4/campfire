import { useEffect, useState } from "react";
import useSurveillance from "../hooks/Surveillance";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

function MapController({ onClick, onReset }: GameMapContainer) {
    const map = useMap();
    useEffect(() => {
        const onMapClick = (event: L.LeafletMouseEvent) => {
            const lat = Math.max(-90, Math.min(90, event.latlng.lat));
            const lng = Math.max(-180, Math.min(180, event.latlng.lng));
            onClick([lat, lng]);
        };
        map.on("click", onMapClick);
    }, [map, onClick]);

    useEffect(() => {
        onReset(() => {
            map.fitBounds()
        });
    }, [map]);
    return null;
}

export default function Game() {
    const [gameNumber, setGameNumber] = useState(0);
    const { src, distance, setGuess, status }: SurveillanceHook =
        useSurveillance(gameNumber);

    // useEffect(() => {
    //     console.log(`New data: ${src}, ${status}`);
    // }, [src, distance, status]);

    return (
        <div className="game">
            <div className="feed-panel">
                {src !== "" ? <img className="feed" src={src} /> : null}
            </div>
            <div className="map-container">
                <MapContainer className="map">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <MapController />
                </MapContainer>
            </div>
        </div>
    );
}
