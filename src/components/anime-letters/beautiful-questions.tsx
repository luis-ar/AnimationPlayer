"use client";
import React, { useEffect, useRef } from "react";

import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";
interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}

const BeautifulQuestions: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
}) => {
  useEffect(() => {
    spanLetters(text, "letters");
    timeLine
      .add(
        ".ml6 .letter",
        {
          translateY: { from: "1.1em", to: 0 },
          translateZ: 0,
          duration: 750,
          delay: (el, i) => 50 * i,
        },
        0
      )
      .add(
        ".ml6",
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
    <h1 className="ml6">
      <span className="text-wrapper">
        <span className="letters">{text}</span>
      </span>
    </h1>
  );
};

export default BeautifulQuestions;
