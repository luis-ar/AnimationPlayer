"use client";
import React, { useEffect, useRef } from "react";
import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const RisingStrong: React.FC<AnimatedLettersProps> = ({ text, timeLine }) => {
  useEffect(() => {
    spanLetters(text, "ml13");

    timeLine
      .add(
        ".ml13 .letter",
        {
          translateY: { from: 100, to: 0 },
          translateZ: 0,
          opacity: { from: 0, to: 1 },
          ease: "outExpo",
          duration: 1400,
          delay: (el, i) => 300 + 30 * i,
        },
        0
      )
      .add(
        ".ml13 .letter",
        {
          translateY: { from: 0, to: -100 },
          opacity: { from: 1, to: 0 },
          ease: "inExpo",
          duration: 1200,
          delay: (el, i) => 100 + 30 * i,
        },
        "<="
      );
  }, []);
  return <h1 className="ml13">{text}</h1>;
};

export default RisingStrong;
