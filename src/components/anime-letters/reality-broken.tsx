"use client";
import React, { useEffect, useRef } from "react";
import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}

const RealityBroken: React.FC<AnimatedLettersProps> = ({ text, timeLine }) => {
  useEffect(() => {
    spanLetters(text, "letters");
    timeLine
      .add(
        ".ml7 .letter",
        {
          translateY: { from: "1.1em", to: 0 },
          translateX: { from: "0.55em", to: 0 },
          translateZ: 0,
          rotateZ: { from: 180, to: 0 },
          duration: 750,
          easing: "outExpo",
          delay: (el, i) => 50 * i,
        },
        0
      )
      .add(
        ".ml7",
        {
          opacity: 0,
          duration: 1000,
          ease: "outExpo",
          delay: 1000,
        },
        "<="
      );
  }, []);
  return (
    <h1 className="ml7">
      <span className="text-wrapper">
        <span className="letters">{text}</span>
      </span>
    </h1>
  );
};

export default RealityBroken;
