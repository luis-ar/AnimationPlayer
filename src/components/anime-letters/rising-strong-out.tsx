"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
}
const RisingStrongOut: React.FC<AnimatedLettersProps> = ({ text }) => {
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
        ".ml39 .letter",
        {
          translateY: { from: 0, to: -100 },
          opacity: { from: 1, to: 0 },
          ease: "inExpo",
          duration: 1200,
          delay: (el, i) => 100 + 30 * i,
        },
        0
      );
    }
  }, []);
  return (
    <h1 className="ml39" ref={textWrapperRef}>
      {text}
    </h1>
  );
};

export default RisingStrongOut;
