"use client";
import React, { useEffect, useRef } from "react";

import { createTimeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
}
const ANewProductionIn: React.FC<AnimatedLettersProps> = ({ text }) => {
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
        ".ml36 .letter",
        {
          translateX: { from: -50, to: 0 },
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
          delay: (el, i) => 100 + 30 * i,
        },
        0
      );
    }
  }, [text]);
  return (
    <h1 className="ml36" ref={textWrapperRef}>
      {text}
    </h1>
  );
};

export default ANewProductionIn;
