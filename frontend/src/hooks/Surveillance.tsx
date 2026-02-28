import React, { useEffect, useState } from "react";

const apiUrl = "https://traffic.ottawa.ca/map/service/camera";
const earthRadius = 6371e6;
const degreesToRadians = Math.PI / 180.0;

export default function useSurveillance(reroll: number): SurveillanceHook {
    const [status, setStatus] = useState(0);
    const [currentData, setCurrentData] = useState<Surveillance>({
        name: "???",
        camera_number: 0,
        latitude: 0,
        longitude: 0,
    });
    const [url, setUrl] = useState<string>("");
    const [feedRef, setFeedRef] = useState<string>(url);
    const [distance, setDistance] = useState<number | undefined>(undefined);
    const [guess, setGuess] = useState<number[] | undefined>(undefined);

    useEffect(() => {
        fetch(apiUrl)
            .then((response) => {
                setStatus(response.status);
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then((data) => {
                const cameras: Surveillance[] = data["cameras"];
                setCurrentData(
                    cameras[Math.floor(Math.random() * cameras.length)],
                );
            });
    }, [reroll]);

    useEffect(() => {
        setUrl(
            `https://traffic.ottawa.ca/camera?id=${currentData.camera_number}`,
        );
    }, [currentData]);

    useEffect(() => {
        if (guess === undefined || guess.length < 2) return;
        const asin = Math.asin;
        const cos = Math.cos;
        const sin2 = (n: number) => Math.pow(Math.sin(n), 2);

        const lat1 = currentData.latitude;
        const lng1 = currentData.longitude;
        const lat2 = guess[0];
        const lng2 = guess[1];
        const theta =
            sin2((lat2 - lat1) / 2) +
            cos(lat1) * cos(lat2) * sin2((lng2 - lng1) / 2);
        setDistance(2 * earthRadius * asin(Math.sqrt(theta)));
    }, [currentData, guess]);

    useEffect(() => {
        const updateFeed = () => setFeedRef(`${url}&t=${Date.now()}`);
        const refreshId = setInterval(updateFeed, 10e3);
        updateFeed();
        return () => {
            clearInterval(refreshId);
        };
    }, [url]);

    return {
        src: feedRef,
        distance: distance,
        setGuess: setGuess,
        status: status,
    };
}
