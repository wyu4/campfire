import { useEffect, useState } from "react";
import Slide, { TutorialSlide } from "../components/Slide";
import "./../style/Story.scss";

export default function Story({ onStoryEnd }: Story) {
    const [slideNumber, setSlideNumber] = useState(0);

    useEffect(() => {
        if (slideNumber <= 123002) return;
        onStoryEnd();
    }, [slideNumber, onStoryEnd]);

    const increaseSlide = () => {
        setSlideNumber((prev) => prev + 1);
    };

    return (
        <div className="story">
            {slideNumber == 0 && (
                <Slide
                    src="/Panel1.webp"
                    dialogue="It's Harvey the squirrel monkey's first day on the job as an agent of the Monkey Bureau of Spies (otherwise known as the MBS). His mission is to make Canada safer for all monkeys."
                    onSlideFinish={increaseSlide}
                />
            )}
            {slideNumber == 1 && (
                <Slide
                    src="/Panel2.webp"
                    dialogue="Unfortunately, Ottawa has an illegal, underground, banana smuggling ring wreaking havoc on the banana industry and monkeys everywhere!"
                    onSlideFinish={increaseSlide}
                />
            )}
            {slideNumber == 2 && (
                <Slide
                    src="/Panel3.webp"
                    dialogue="Harvey the monkey must stop this banana cartel by looking at traffic camera footage of the locations of criminal activities, and determine whereabout it is taking place within Ottawa."
                    onSlideFinish={increaseSlide}
                />
            )}
            {slideNumber == 3 && (
                <TutorialSlide
                    src="/ComputerBackground.webp"
                    dialogue=""
                    onSlideFinish={onStoryEnd}
                />
            )}
        </div>
    );
}
