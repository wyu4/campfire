import { useRef } from "react";

export default function BackgroundAudio({ src, looping }: BackgroundAudio) {
    const audioRef = useRef<HTMLAudioElement>(null);

    

    return (
        <audio ref={audioRef} loop={looping}>
            <source src={src} type="audio/mpeg" />
        </audio>
    );
}
