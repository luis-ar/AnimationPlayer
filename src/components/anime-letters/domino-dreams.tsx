"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const DominoDreams: React.FC<AnimatedLettersProps> = ({ text, timeLine }) => {
  useEffect(() => {
    spanLetters(text, "letters");
    timeLine
      .add(
        ".ml10 .letter",
        {
          rotateY: { from: -90, to: 0 },
          duration: 1300,
          delay: (el, i) => 45 * i,
        },
        0
      )
      .add(
        ".ml10",
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
    <h1 className="ml10">
      <span className="text-wrapper">
        <span className="letters">{text}</span>
      </span>
    </h1>
  );
};

export default DominoDreams;
