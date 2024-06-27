"use client";
import React, { useEffect, useRef } from "react";

import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const ANewProduction: React.FC<AnimatedLettersProps> = ({ text, timeLine }) => {
  useEffect(() => {
    spanLetters(text, "ml12");
    timeLine
      .add(
        ".ml12 .letter",
        {
          translateX: { from: 40, to: 0 },
          translateZ: 0,
          opacity: { from: 0, to: 1 },
          ease: "outExpo",
          duration: 1200,
          delay: (el, i) => 500 + 30 * i,
        },
        0
      )
      .add(
        ".ml12 .letter",
        {
          translateX: { from: 0, to: 30 },
          opacity: { from: 1, to: 0 },
          ease: "inExpo",
          duration: 1100,
          delay: (el, i) => 100 + 30 * i,
        },
        "<="
      );
  }, [text]);
  return <h1 className="ml12">{text}</h1>;
};

export default ANewProduction;
