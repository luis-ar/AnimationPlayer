"use client";
import React, { useEffect, useRef } from "react";
import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
  from: number;
  to: number;
}
const BunnyEars: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
  from,
  to,
}) => {
  useEffect(() => {
    spanLetters(text, "text1");
    const timeFrom = (from / 30) * 1000;
    const timeTo = (to / 30) * 1000;
    timeLine
      .add(
        ".ml42 .text",
        {
          scale: { from: 0, to: 1 },
          ease: "inOutQuad",
          opacity: 0.7,
          duration: 1500,
          delay: timeFrom,
        },
        0
      )
      .add(
        ".ml42 .letter",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1500,
          delay: (el, i) => 150 * (i + 1) + timeFrom,
        },
        "<-=1000"
      )
      .add(
        ".ml42 .text",
        {
          scale: { from: 1, to: 0 },
          ease: "inOutQuad",
          duration: 1000,
          delay: timeTo - 3500,
        },
        "<-=1000"
      )
      .add(
        ".ml42 .letter",
        {
          opacity: { from: 1, to: 0 },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=1300"
      );
  }, [text]);
  return (
    <div className="ml42">
      <p className="text">”</p>
      <span className="text1">{text}</span>
    </div>
  );
};

export default BunnyEars;
