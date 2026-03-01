import { useGSAP } from "@gsap/react";
import PushButton from "../components/PushButton";
import "./../style/Menu.scss";
import { useRef, useState } from "react";
import gsap from "gsap";

export function Menu({ onPlay }: Menu) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    useGSAP(
        () => {
            if (playing) {
                gsap.to(".blob", {
                    translateY: "100cqh",
                    rotate: 20,
                    duration: 0.5,
                    ease: "sine.in",
                    overwrite: "auto",
                });
                gsap.to(".play", {
                    translateY: "100cqh",
                    rotate: -10,
                    delay: 0.25,
                    duration: 0.5,
                    ease: "sine.in",
                    overwrite: "auto",
                });
                gsap.to(".menu", {
                    backgroundColor: "#000000",
                    duration: 1,
                    overwrite: "auto",
                    onComplete: onPlay,
                });
                return;
            }
            gsap.set(".blob", {
                scale: 0,
                rotate: 25,
            });
            gsap.set(".play", {
                scale: 0,
                rotate: -10,
            });
            gsap.timeline()
                .to(".blob", {
                    scale: 1,
                    rotate: 0,
                    duration: 1,
                    ease: "back.out",
                    overwrite: "auto",
                })
                .to(".play", {
                    scale: 1,
                    rotate: 0,
                    duration: 1,
                    ease: "back.out",
                    overwrite: "auto",
                });
        },
        {
            dependencies: [playing],
        },
    );

    const handlePlay = () => {
        setPlaying(true);
    };

    return (
        <div ref={menuRef} className="menu">
            <img className="blob" src="/Titleblob.webp" />
            <PushButton
                className="play"
                onClick={handlePlay}
                disabled={playing}
            >
                <img src="/PlayButton.webp" width={"50%"} />
            </PushButton>
        </div>
    );
}
