"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
  from: number;
  to: number;
}
const LineUp: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
  from,
  to,
}) => {
  useEffect(() => {
    const timeFrom = (from / 30) * 1000;
    const timeTo = (to / 30) * 1000;
    timeLine
      .add(
        ".ml41 .line",
        {
          width: { from: "0%", to: "100%" },
          ease: "inOutQuad",
          opacity: 1,
          duration: 1500,
          delay: timeFrom,
        },
        0
      )
      .add(
        ".ml41 .text",
        {
          opacity: { from: 0, to: 1 },
          bottom: { from: "50%", to: "0%" },
          ease: "inOutQuad",
          duration: 1500,
          delay: timeFrom,
        },
        "<-=500"
      )
      .add(
        ".ml41 .line",
        {
          width: { from: "100%", to: "0%" },
          ease: "inOutQuad",
          duration: 1000,
          delay: timeTo - 2500,
        },
        "<-=1000"
      )
      .add(
        ".ml41 .text",
        {
          opacity: { from: 1, to: 0 },
          bottom: { from: "0%", to: "50%" },
          ease: "inOutQuad",
          duration: 1000,
          delay: timeFrom,
        },
        "<-=1500"
      );
  }, [text]);
  return (
    <div className="ml41">
      <div className="line"></div>
      <span className="text">choose happiness hahahahhaha</span>
    </div>
  );
};

export default LineUp;
