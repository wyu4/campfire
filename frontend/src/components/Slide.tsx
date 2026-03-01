import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { forwardRef, useEffect, useRef, useState } from "react";

const Slide = forwardRef<HTMLDivElement, Slide>(
    ({ dialogue, src, onSlideFinish }, forwardRef) => {
        const slideRef = useRef<HTMLDivElement>(null);
        const [skipped, setSkipped] = useState(false);
        const [loaded, setLoaded] = useState(false);

        const handleSlideFinish = () => {
            gsap.to(".cover", {
                opacity: 1,
                duration: 0.25,
                overwrite: "auto",
                onComplete: onSlideFinish,
            });
        };

        useEffect(() => {
            if (!loaded) return;
            const skip = () => {
                if (skipped) {
                    handleSlideFinish();
                    return;
                }
                setSkipped(true);
            };
            const spaceSkip = (event: KeyboardEvent) => {
                if (event.key == " ") {
                    if (skipped) {
                        handleSlideFinish();
                        return;
                    }
                    setSkipped(true);
                }
            };
            window.addEventListener("click", skip);
            window.addEventListener("keydown", spaceSkip);

            return () => {
                window.removeEventListener("click", skip);
                window.removeEventListener("keydown", spaceSkip);
            };
        }, [loaded, skipped, onSlideFinish]);

        useGSAP(
            () => {
                if (!loaded) return;
                gsap.to(".cover", {
                    opacity: 0,
                    duration: 0.25,
                    overwrite: "auto",
                });
            },
            {
                dependencies: [loaded],
                scope: slideRef,
            },
        );

        useGSAP(
            () => {
                if (!loaded) return;
                const splitDialogue = SplitText.create(".dialogue P", {
                    type: "words chars",
                });

                if (skipped) {
                    gsap.to(splitDialogue.chars, {
                        opacity: 1,
                        translateY: 0,
                        duration: 0,
                        overwrite: "auto",
                    });
                    return;
                }

                gsap.set(splitDialogue.chars, {
                    opacity: 0,
                    translateY: 20,
                });
                gsap.to(splitDialogue.chars, {
                    opacity: 1,
                    translateY: 0,
                    ease: "power2.out",
                    duration: 0.25,
                    stagger: {
                        each: 0.02,
                        from: "start",
                    },
                    overwrite: "auto",
                    onComplete: () => setSkipped(true),
                });
            },
            {
                dependencies: [loaded, skipped],
                scope: slideRef,
            },
        );

        return (
            <div
                className="slide"
                ref={(node) => {
                    slideRef.current = node;
                    if (forwardRef) {
                        if (typeof forwardRef === "function") forwardRef(node);
                        else forwardRef.current = node;
                    }
                }}
            >
                <img src={src} onLoad={() => setLoaded(true)} />
                <div className="dialogue">
                    <p>{dialogue}</p>
                </div>
                <div className="cover" />
            </div>
        );
    },
);

export const TutorialSlide = forwardRef<HTMLDivElement, Slide>(
    ({ src, onSlideFinish }, forwardRef) => {
        const slideRef = useRef<HTMLDivElement>(null);
        const [skipped, setSkipped] = useState(false);
        const [dialogue, setDialogue] = useState("");
        const [phase, setPhase] = useState(0);
        const [loaded, setLoaded] = useState(false);

        useEffect(() => {
            if (!loaded) return;
            const skip = () => {
                if (skipped) {
                    setPhase((prev) => prev + 1);
                    return;
                }
                setSkipped(true);
            };
            const spaceSkip = (event: KeyboardEvent) => {
                if (event.key == " ") {
                    if (skipped) {
                        setPhase((prev) => prev + 1);
                        return;
                    }
                    setSkipped(true);
                }
            };
            window.addEventListener("click", skip);
            window.addEventListener("keydown", spaceSkip);

            return () => {
                window.removeEventListener("click", skip);
                window.removeEventListener("keydown", spaceSkip);
            };
        }, [loaded, skipped, onSlideFinish]);

        useGSAP(
            () => {
                if (!loaded) return;
                gsap.to(".cover", {
                    opacity: 0,
                    duration: 0.25,
                    overwrite: "auto",
                });
            },
            {
                dependencies: [loaded],
                scope: slideRef,
            },
        );

        useGSAP(
            () => {
                if (!loaded) return;
                if (phase == 0) {
                    setDialogue("The footage will be shown on his computer.");
                    gsap.to(".image", {
                        scale: 1.5,
                        translateX: "20%",
                        translateY: "10%",
                        duration: 1,
                        ease: "sine.inOut",
                        overwrite: "auto",
                    });
                } else if (phase == 1) {
                    setDialogue(
                        "So after assesing the scene, click on the map where you believe it is. Make 5 guesses within 4 km of the actual location in order to have gathered enough intel to take down the cartel and save bananas worldwide!",
                    );
                    gsap.to(".image", {
                        scale: 1.6,
                        translateX: "-25%",
                        translateY: "20%",
                        duration: 1,
                        ease: "sine.inOut",
                        overwrite: "auto",
                    });
                } else {
                    setDialogue("");
                    gsap.to(".image", {
                        scale: 1,
                        translateX: 0,
                        translateY: 0,
                        duration: 1,
                        ease: "sine.inOut",
                        overwrite: "auto",
                        onComplete: onSlideFinish,
                    });
                }
                setSkipped(false);
            },
            {
                dependencies: [loaded, phase],
                scope: slideRef,
            },
        );

        useGSAP(
            () => {
                if (!loaded || dialogue == "") return;
                const splitDialogue = SplitText.create(".dialogue P", {
                    type: "words chars",
                });

                if (skipped) {
                    gsap.to(splitDialogue.chars, {
                        opacity: 1,
                        translateY: 0,
                        duration: 0,
                        overwrite: "auto",
                    });
                } else {
                    gsap.set(splitDialogue.chars, {
                        opacity: 0,
                        translateY: 20,
                    });
                    gsap.to(splitDialogue.chars, {
                        opacity: 1,
                        translateY: 0,
                        ease: "power2.out",
                        duration: 0.25,
                        stagger: {
                            each: 0.02,
                            from: "start",
                        },
                        overwrite: "auto",
                        onComplete: () => setSkipped(true),
                    });
                }

                return () => {
                    splitDialogue.revert();
                };
            },
            {
                dependencies: [loaded, skipped, dialogue],
                scope: slideRef,
            },
        );

        return (
            <div
                className="slide tutorial"
                ref={(node) => {
                    slideRef.current = node;
                    if (forwardRef) {
                        if (typeof forwardRef === "function") forwardRef(node);
                        else forwardRef.current = node;
                    }
                }}
            >
                <img
                    className="image"
                    src={src}
                    onLoad={() => setLoaded(true)}
                />
                <div className="dialogue">
                    <p key={dialogue}>{dialogue}</p>
                </div>
                <div className="cover" />
            </div>
        );
    },
);

export default Slide;
