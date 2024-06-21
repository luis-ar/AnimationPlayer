"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../anime/anime";
import "./style.css";
interface AnimatedLettersProps {
  text: string;
}
const NinthAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
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
        ".ml9 .letter",
        {
          scale: { from: 0, to: 1 },
          elasticity: 600,
          duration: 750,
          delay: (el, i) => 50 * i,
        },
        0
      ).add(
        ".ml9",
        {
          opacity: 0,
          duration: 1000,
          ease: "outExpo",
          delay: 1000,
        },
        "<="
      );
    }
  }, [text]);
  return (
    <h1 className="ml9">
      <span className="text-wrapper">
        <span className="letters" ref={textWrapperRef}>
          {text}
        </span>
      </span>
    </h1>
  );
};

export default NinthAnimation;
