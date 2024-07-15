"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const RisingStrongIn: React.FC<AnimatedLettersProps> = ({ text, timeLine }) => {
  useEffect(() => {
    spanLetters(text, "ml38");

    timeLine.add(
      ".ml38 .letter",
      {
        translateY: { from: 100, to: 0 },
        translateZ: 0,
        opacity: { from: 0, to: 1 },
        ease: "outExpo",
        duration: 1400,
        delay: (el, i) => 300 + 30 * i,
      },
      0
    );
  }, []);
  return <h1 className="ml38">{text}</h1>;
};

export default RisingStrongIn;
