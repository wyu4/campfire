import { useEffect, useState } from "react";
import { haversineDistance } from "../utils/CoordinateUtils";

const apiUrl = "https://traffic.ottawa.ca/map/service/camera";

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
        const updateFeed = () => setFeedRef(`${url}&t=${Date.now()}`);
        const refreshId = setInterval(updateFeed, 10e3);
        updateFeed();
        return () => {
            clearInterval(refreshId);
        };
    }, [url]);

    const getDistance = (guess: number[]): number => {
        if (guess.length < 2) return 0;
        return haversineDistance(guess, [
            currentData.latitude,
            currentData.longitude,
        ]);
    };

    return {
        src: feedRef,
        getDistance: getDistance,
        answer: [currentData.latitude, currentData.longitude],
        status: status,
    };
}
