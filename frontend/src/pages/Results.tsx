import { MapContainer, TileLayer, useMap } from "react-leaflet";
import {
    haversineDistance,
    midpoint,
    OttawaBounds,
    WorldBounds,
} from "../utils/CoordinateUtils";
import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "./../style/Results.scss";

const guessIcon = new L.Icon({
    iconUrl: "/Marker.webp",
    iconSize: [50, 50],
});

const answerIcon = new L.Icon({
    iconUrl: "/Marker2.webp",
    iconSize: [50, 50],
});

const ResultsMapController = ({ guess, answer }: ResultsMapController) => {
    const map = useMap();

    useEffect(() => {
        const center = (
            guess ? midpoint(guess, answer) : answer
        ) as LatLngExpression;

        map.fitBounds(OttawaBounds, {
            animate: false,
        });
        const fitDelay = setTimeout(() => {
            if (guess) {
                const bounds = L.latLngBounds([
                    guess as LatLngExpression,
                    answer as LatLngExpression,
                ]);
                map.fitBounds(bounds);
                return;
            }
            map.setView(answer as LatLngExpression, 13, {
                animate: true,
            });
        }, 500);

        const distance = L.marker(center, {
            icon: L.divIcon({
                className: "distance",
                html: `<div><p>${guess ? haversineDistance(guess, answer).toFixed(2) + "km" : ""}</p></div>`,
            }),
        }).addTo(map);
        const answerMarker = L.marker(answer as LatLngExpression, {
            icon: answerIcon,
        }).addTo(map);

        let guessMarker = undefined;
        let line = undefined;

        if (guess) {
            guessMarker = L.marker(guess as LatLngExpression, {
                icon: guessIcon,
            }).addTo(map);
            console.log(answer);
            const path: LatLngExpression[] = [
                guess as LatLngExpression,
                answer as LatLngExpression,
            ];
            line = L.polyline(path).addTo(map);
        }

        return () => {
            clearTimeout(fitDelay);
            map.removeLayer(distance);
            map.removeLayer(answerMarker);
            if (guessMarker) {
                map.removeLayer(guessMarker);
            }

            if (line) {
                map.removeLayer(line);
            }
        };
    }, [guess, answer, map]);

    return null;
};

export default function Results({ guess, answer }: Results) {
    return (
        <div className="results">
            <MapContainer
                className="map"
                attributionControl={false}
                maxBounds={WorldBounds}
            >
                <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
                <ResultsMapController guess={guess} answer={answer} />
            </MapContainer>
        </div>
    );
}
