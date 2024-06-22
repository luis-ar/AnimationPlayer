"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
}
const RisingStrongIn: React.FC<AnimatedLettersProps> = ({ text }) => {
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
        ".ml38 .letter",
        {
          translateY: { from: 100, to: 0 },
          translateZ: 0,
          opacity: { from: 0, to: 1 },
          ease: "outExpo",
          duration: 1400,
          delay: (el, i) => 300 + 30 * i,
        },
        0
      );
    }
  }, []);
  return (
    <h1 className="ml38" ref={textWrapperRef}>
      {text}
    </h1>
  );
};

export default RisingStrongIn;
