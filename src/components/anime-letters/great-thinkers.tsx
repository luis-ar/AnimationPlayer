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
const GreatThinkers: React.FC<AnimatedLetterProps> = ({
  text,
  timeLine,
  from,
}) => {
  useEffect(() => {
    spanLetters(text, "ml3");
    const time = (from / 30) * 1000;
    timeLine
      .add(
        ".ml3 .letter",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 2250,
          delay: (el, i) => 150 * (i + 1) + time,
        },
        0
      )
      .add(
        ".ml3",
        {
          opacity: 0,
          ease: "outExpo",
          duration: 1000,
          delay: 1000,
        },
        "<="
      );
  }, [timeLine, text, from]);
  // utils.cleanInlineStyles(timeLine);

  return <h1 className="ml3">{text}</h1>;
};

export default GreatThinkers;
