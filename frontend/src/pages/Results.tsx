import { MapContainer, TileLayer, useMap } from "react-leaflet";
import {
    haversineDistance,
    midpoint,
    OttawaBounds,
    WorldBounds,
} from "../utils/CoordinateUtils";
import { useEffect, useRef, useState } from "react";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "./../style/Results.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

import Theme from "./../style/Theme.module.scss";
import PushButton from "../components/PushButton";

const guessIcon = new L.Icon({
    iconUrl: "/Marker.webp",
    iconSize: [100, 100],
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

export default function Results({
    guess,
    answer,
    won,
    onLeave,
}: Results & { onLeave: (leaveType: LeaveType) => void }) {
    const resultsRef = useRef<HTMLDivElement>(null);
    const [leaving, setLeaving] = useState<LeaveType>("None");

    const handleRetry = () => {
        setLeaving("Retry");
    };

    const handleHome = () => {
        setLeaving("Home");
    };

    useGSAP(
        () => {
            const title = SplitText.create(".title", {
                type: "chars",
            });

            gsap.set([title.chars, ".retry", ".home"], {
                scale: 0,
                opacity: 0,
                ease: "power2.out",
            });

            const tl = gsap.timeline();
            tl.to([title.chars, ".retry", ".home"], {
                scale: 1,
                opacity: 1,
                color: won ? Theme["success"] : Theme["fail"],
                duration: 0.5,
                stagger: 0.05,
                // overwrite: "auto",
            });

            return () => {
                title.revert();
            };
        },
        {
            dependencies: [won],
            scope: resultsRef,
        },
    );

    useGSAP(
        () => {
            if (leaving === "None") return;
            const title = SplitText.create(".title", {
                type: "chars",
            });
            gsap.timeline()
                .to([title.chars, ".retry", ".home"], {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: "power2.out",
                    overwrite: "auto",
                })
                .to(".map", {
                    translateY: "150cqh",
                    rotate: 10,
                    duration: 0.5,
                    ease: "sine.in",
                    overwrite: "auto",
                    onComplete: () => {
                        setTimeout(() => onLeave(leaving), 1000);
                    },
                });
            return () => {
                title.revert();
            };
        },
        { dependencies: [leaving, won], scope: resultsRef },
    );

    return (
        <div className="results" ref={resultsRef}>
            <MapContainer
                className="map"
                attributionControl={false}
                maxBounds={WorldBounds}
            >
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ResultsMapController guess={guess} answer={answer} />
            </MapContainer>
            <div className="overlay">
                <h2 className="title">
                    {won ? "Mission Success" : "Mission Failed"}
                </h2>
                <div>
                    <PushButton
                        className="retry"
                        disabled={leaving !== "None"}
                        onClick={handleRetry}
                    >
                        <img
                            src={won ? "/GreenRetry.webp" : "/RedRetry.webp"}
                        />
                    </PushButton>
                    <PushButton
                        className="home"
                        disabled={leaving !== "None"}
                        onClick={handleHome}
                    >
                        <img src="/HomeButton.webp" />
                    </PushButton>
                </div>
            </div>
        </div>
    );
}
