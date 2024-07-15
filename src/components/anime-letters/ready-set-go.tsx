"use client";
import React, { useEffect, useRef } from "react";
import "../style.css";
import { Timeline, createTimeline, utils } from "../../anime/anime";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
  from: number;
}

const ReadySetGo: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
  from,
}) => {
  useEffect(() => {
    const words = text.split(" ");
    const time = (from / 30) * 1000;
    const ml4 = {
      opacityIn: { from: 0, to: 1 },
      scaleIn: { from: 0.2, to: 1 },
      scaleOut: 3,
      durationIn: 800,
      durationOut: 600,
      delay: 700,
    };
    words.forEach((word, index) => {
      timeLine
        .add(
          `.ml4 .letters-${index}`,
          {
            opacity: ml4.opacityIn,
            scale: ml4.scaleIn,
            duration: ml4.durationIn,
            delay: index === 0 && time,
          },
          index === 0 ? 0 : "<="
        )
        .add(
          `.ml4 .letters-${index}`,
          {
            opacity: { from: 1, to: 0 },
            scale: ml4.scaleOut,
            duration: ml4.durationOut,
            ease: "inExpo",
            delay: ml4.delay,
          },
          "<="
        );
    });
    timeLine.add(
      ".ml4",
      {
        opacity: 0,
        duration: 500,
        delay: 1400 * words.length + time,
      },
      "<="
    );
  }, [timeLine, text, from]);
  // utils.cleanInlineStyles(timeLine);
  const words = text.split(" ");

  return (
    <h1 className="ml4">
      {words.map((word, index) => (
        <span key={index} className={`letters letters-${index}`}>
          {word}
        </span>
      ))}
    </h1>
  );
};

export default ReadySetGo;
