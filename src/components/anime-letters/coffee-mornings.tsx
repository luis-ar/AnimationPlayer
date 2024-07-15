"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";
interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const CoffeeMornings: React.FC<AnimatedLettersProps> = ({ text, timeLine }) => {
  useEffect(() => {
    spanLetters(text, "letters");

    timeLine
      .add(
        ".ml9 .letter",
        {
          scale: { from: 0, to: 1 },
          elasticity: 600,
          duration: 750,
          delay: (el, i) => 50 * i,
        },
        0
      )
      .add(
        ".ml9",
        {
          opacity: 0,
          duration: 1000,
          ease: "outExpo",
          delay: 1000,
        },
        "<="
      );
  }, [text]);
  return (
    <h1 className="ml9">
      <span className="text-wrapper">
        <span className="letters">{text}</span>
      </span>
    </h1>
  );
};

export default CoffeeMornings;
