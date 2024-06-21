"use client";
import React, { useEffect, useRef } from "react";

import { createTimeline } from "../anime/anime";
import "./style.css";

interface AnimatedLettersProps {
  text: string;
}
const FourteenAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
  const textWrapperRef = useRef<HTMLHeadingElement>(null);
  const tl = createTimeline({
    loop: true,
  });
  useEffect(() => {
    if (textWrapperRef.current) {
      const textWrapper = textWrapperRef.current;

      textWrapper.innerHTML = textWrapper.textContent!.replace(
        /\S/g,
        "<span className='letter'>$&</span>"
      );

      tl.add(
        ".ml14 .line",
        {
          scaleX: { from: 0, to: 1 },
          opacity: { from: 0.5, to: 1 },
          ease: "inOutExpo",
          duration: 900,
        },
        0
      )
        .add(
          ".ml14 .letter",
          {
            opacity: { from: 0, to: 1 },
            translateX: { from: 40, to: 0 },
            translateZ: 0,
            scaleX: { from: 0.3, to: 1 },
            ease: "outExpo",
            duration: 800,
            delay: (el, i) => 150 + 25 * i,
          },
          "<-=600"
        )
        .add(
          ".ml14",
          {
            opacity: 0,
            duration: 1000,
            ease: "outExpo",
            delay: 1000,
          },
          "<="
        );
    }
  }, []);
  return (
    <h1 className="ml14">
      <span className="text-wrapper">
        <span className="letters" ref={textWrapperRef}>
          {text}
        </span>
        <span className="line"></span>
      </span>
    </h1>
  );
};

export default FourteenAnimation;
