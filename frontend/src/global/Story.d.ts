declare type Story = {
    onStoryEnd: () => void;
};

declare type StoryEnd = Story & {
    won: boolean;
};
