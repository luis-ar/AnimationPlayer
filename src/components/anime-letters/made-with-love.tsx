"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}

const MadeWithLove: React.FC<AnimatedLettersProps> = ({ text, timeLine }) => {
  useEffect(() => {
    spanLetters(text, "ml16");
    timeLine
      .add(
        ".ml16 .letter",
        {
          translateY: { from: -100, to: 0 },
          ease: "outExpo",
          duration: 1400,
          delay: (el, i) => 30 * i,
        },
        0
      )
      .add(
        ".ml16",
        {
          opacity: 0,
          duration: 1000,
          ease: "outExpo",
          delay: 1000,
        },
        "<="
      );
  }, [text]);

  return <h1 className="ml16">{text}</h1>;
};

export default MadeWithLove;
