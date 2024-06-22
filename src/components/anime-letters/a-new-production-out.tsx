"use client";
import React, { useEffect, useRef } from "react";

import { createTimeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
}
const ANewProductionOut: React.FC<AnimatedLettersProps> = ({ text }) => {
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
        ".ml37 .letter",
        {
          translateX: { from: 0, to: 50 },
          opacity: { from: 1, to: 0 },

          ease: "inOutQuad",
          duration: 1000,
          delay: (el, i) => 100 + 30 * i,
        },
        0
      );
    }
  }, [text]);
  return (
    <h1 className="ml37" ref={textWrapperRef}>
      {text}
    </h1>
  );
};

export default ANewProductionOut;
