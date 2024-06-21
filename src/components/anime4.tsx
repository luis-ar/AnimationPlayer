"use client";
import React, { useEffect, useRef } from "react";
import "./style.css";
import { createTimeline } from "../anime/anime";

interface AnimatedLettersProps {
  text: string;
}

const FourthAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
  const animationRef = useRef(null);
  const tl = createTimeline({
    loop: true,
  });
  useEffect(() => {
    if (animationRef.current) {
      const words = text.split(" ");

      const ml4 = {
        opacityIn: [0, 1],
        scaleIn: [0.2, 1],
        scaleOut: 3,
        durationIn: 800,
        durationOut: 600,
        delay: 500,
      };
      words.forEach((word, index) => {
        tl.add(
          `.ml4 .letters-${index}`,
          {
            opacity: ml4.opacityIn,
            scale: ml4.scaleIn,
            duration: ml4.durationIn,
          },
          index === 0 ? 0 : "<="
        ).add(
          `.ml4 .letters-${index}`,
          {
            opacity: 0,
            scale: ml4.scaleOut,
            duration: ml4.durationOut,
            ease: "inExpo",
            delay: ml4.delay,
          },
          "<="
        );
      });
      tl.add(
        ".ml4",
        {
          opacity: 0,
          duration: 500,
          delay: 500,
        },
        "<="
      );
    }
  }, [text]);
  const words = text.split(" ");

  return (
    <h1 ref={animationRef} className="ml4">
      {words.map((word, index) => (
        <span key={index} className={`letters letters-${index}`}>
          {word}
        </span>
      ))}
    </h1>
  );
};

export default FourthAnimation;
