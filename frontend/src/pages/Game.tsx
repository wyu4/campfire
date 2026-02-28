import { useEffect, useState } from "react";
import useSurveillance from "../hooks/Surveillance";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

function MapController() {
    const map = useMap();
    
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
