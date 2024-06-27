"use client";
import React, { useEffect, useRef } from "react";

import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const ANewProductionIn: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
}) => {
  useEffect(() => {
    spanLetters(text, "ml36");
    timeLine.add(
      ".ml36 .letter",
      {
        translateX: { from: -50, to: 0 },
        opacity: { from: 0, to: 1 },
        ease: "inOutQuad",
        duration: 1000,
        delay: (el, i) => 100 + 30 * i,
      },
      0
    );
  }, [text]);
  return <h1 className="ml36">{text}</h1>;
};

export default ANewProductionIn;
