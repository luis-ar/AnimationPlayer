"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
}
const RisingStrongOut: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
}) => {
  useEffect(() => {
    spanLetters(text, "ml39");

    timeLine.add(
      ".ml39 .letter",
      {
        translateY: { from: 0, to: -100 },
        opacity: { from: 1, to: 0 },
        ease: "inExpo",
        duration: 1200,
        delay: (el, i) => 100 + 30 * i,
      },
      0
    );
  }, []);
  return <h1 className="ml39">{text}</h1>;
};

export default RisingStrongOut;
