"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";
interface AnimatedLetterProps {
  text: string;
  timeLine: Timeline;
  from: number;
}
const SunnyMornings: React.FC<AnimatedLetterProps> = ({
  text,
  timeLine,
  from,
}) => {
  useEffect(() => {
    spanLetters(text, "ml2");
    const time = (from / 30) * 1000;
    timeLine
      .add(
        ".ml2 .letter",
        {
          scale: { from: 4, to: 1 },
          opacity: { from: 0, to: 1 },
          translateZ: 0,
          ease: "outExpo",
          duration: 1000,
          delay: (el, i) => 70 * i + time,
        },
        0
      )
      .add(
        ".ml2",
        {
          opacity: 0,
          ease: "outExpo",
          duration: 700,
          delay: 1000,
        },
        "<="
      );
  }, [timeLine, text, from]);
  // utils.cleanInlineStyles(timeLine);

  return (
    <div>
      <h1 className="ml2">{text}</h1>
    </div>
  );
};

export default SunnyMornings;
