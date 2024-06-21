"use client";
import React, { useEffect, useRef } from "react";

import { createTimeline } from "../anime/anime";
import "./style.css";

interface AnimatedLettersProps {
  text: string;
}
const TwelveAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
  const textWrapperRef = useRef<HTMLHeadingElement>(null);
  const tl = createTimeline({
    loop: true,
  });
  useEffect(() => {
    if (textWrapperRef.current) {
      const textWrapper = textWrapperRef.current;

      textWrapper.innerHTML = textWrapper.textContent!.replace(
        /\S/g,
        "<span class='letter'>$&</span>"
      );

      tl.add(
        ".ml12 .letter",
        {
          translateX: { from: 40, to: 0 },
          translateZ: 0,
          opacity: { from: 0, to: 1 },
          ease: "outExpo",
          duration: 1200,
          delay: (el, i) => 500 + 30 * i,
        },
        0
      ).add(
        ".ml12 .letter",
        {
          translateX: { from: 0, to: -30 },
          opacity: { from: 1, to: 0 },
          ease: "inExpo",
          duration: 1100,
          delay: (el, i) => 100 + 30 * i,
        },
        "<="
      );
    }
  }, [text]);
  return (
    <h1 className="ml12" ref={textWrapperRef}>
      {text}
    </h1>
  );
};

export default TwelveAnimation;
