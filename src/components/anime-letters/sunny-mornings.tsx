"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../../anime/anime";
import "../style.css";
interface AnimatedLetterProps {
  text: string;
}
const SunnyMornings: React.FC<AnimatedLetterProps> = ({ text }) => {
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
        ".ml2 .letter",
        {
          scale: { from: 4, to: 1 },
          opacity: { from: 0, to: 1 },
          translateZ: 0,
          ease: "outExpo",
          duration: 1000,
          delay: (el, i) => 70 * i,
        },
        0
      ).add(
        ".ml2",
        {
          opacity: 0,
          ease: "outExpo",
          duration: 700,
          delay: 1000,
        },
        "<="
      );
    }
  }, []);
  return (
    <div>
      <h1 ref={textWrapperRef} className="ml2">
        {text}
      </h1>
    </div>
  );
};

export default SunnyMornings;
