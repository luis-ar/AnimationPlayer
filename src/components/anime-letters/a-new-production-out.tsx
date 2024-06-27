"use client";
import React, { useEffect, useRef } from "react";

import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const ANewProductionOut: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
}) => {
  useEffect(() => {
    spanLetters(text, "ml37");

    timeLine.add(
      ".ml37 .letter",
      {
        translateX: { from: 0, to: 50 },
        opacity: { from: 1, to: 0 },

        ease: "inOutQuad",
        duration: 1000,
        delay: (el, i) => 100 + 30 * i,
      },
      0
    );
  }, [text]);
  return <h1 className="ml37">{text}</h1>;
};

export default ANewProductionOut;
