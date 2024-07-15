import { Player, PlayerRef } from "@remotion/player";
import { ITrackItem } from "./types";
import Thursday from "./components/anime-letters/Thursday";
import SunnyMornings from "./components/anime-letters/sunny-mornings";
import { Sequence } from "remotion";
import { createTimeline } from "./anime/anime";
import { useEffect, useRef, useState } from "react";
import { useCurrentPlayerFrame } from "./use-current-frame";
import GreatThinkers from "./components/anime-letters/great-thinkers";
import ReadySetGo from "./components/anime-letters/ready-set-go";
import SeventeenAnimation from "./components/anime-letters/anime17";
import Outro from "./components/anime-letters/outro";
import LineUp from "./components/anime-letters/line-up";
import BunnyEars from "./components/anime-letters/bunny-ears";
import CrissCross from "./components/anime-letters/criss-cross";
import HighLight from "./components/anime-letters/high-light";

const effectsMap = {
  thursday: Thursday,
  sunnyMornings: SunnyMornings,
  greatThinkers: GreatThinkers,
  readySetGo: ReadySetGo,
  seventeenAnimation: SeventeenAnimation,
  outro: Outro,
  lineUp: LineUp,
  bunnyEars: BunnyEars,
  crissCross: CrissCross,
  highLight: HighLight,
};
const timeLine = createTimeline({
  loop: false,
  autoplay: false,
});
type EffectsMap = typeof effectsMap;
type EffectName = keyof EffectsMap;
function Scene({ trackItems }: { trackItems: ITrackItem[] }) {
  const playerRef = useRef<PlayerRef>();
  const [isPaused, setIsPaused] = useState(false);

  const currentFrame = useCurrentPlayerFrame(playerRef!);

  useEffect(() => {
    if (isPaused) {
      timeLine.pause();
    } else {
      timeLine.seek((currentFrame / 30) * 1000, true);
      timeLine.play();
    }
  }, [currentFrame, isPaused]);

  useEffect(() => {
    const player = playerRef.current;

    const handlePause = () => setIsPaused(true);
    const handlePlay = () => setIsPaused(false);

    if (player) {
      player.addEventListener("pause", handlePause);
      player.addEventListener("play", handlePlay);
    }
    return () => {
      if (player) {
        player.removeEventListener("pause", handlePause);
        player.removeEventListener("play", handlePlay);
      }
    };
  }, []);
  return (
    <>
      <Player
        compositionHeight={700}
        compositionWidth={1200}
        fps={30}
        durationInFrames={trackItems[trackItems.length - 1].display.to}
        component={MyComp}
        controls
        inputProps={{ trackItems }}
        ref={playerRef}
        style={{ backgroundColor: "#5b5757" }}
      />
    </>
  );
}

const MyComp = ({ trackItems }: { trackItems: ITrackItem[] }) => {
  return (
    <>
      {trackItems.map((item) => {
        const EffectComponent = effectsMap[item.animation as EffectName];

        if (!EffectComponent) {
          console.error(`Effect component "${item.animation}" not found.`);
          return null;
        }
        return (
          <Sequence
            from={item.display.from}
            durationInFrames={item.display.to}
            key={item.display.from}
          >
            <EffectComponent
              text={item.details.text}
              timeLine={timeLine}
              from={item.display.from}
              to={item.display.to}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export default Scene;
