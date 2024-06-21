"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../anime/anime";
import "./style.css";

interface AnimatedLettersProps {
  text: string;
}

const SeventhAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
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
        ".ml7 .letter",
        {
          translateY: { from: "1.1em", to: 0 },
          translateX: { from: "0.55em", to: 0 },
          translateZ: 0,
          rotateZ: { from: 180, to: 0 },
          duration: 750,
          easing: "outExpo",
          delay: (el, i) => 50 * i,
        },
        0
      ).add(
        ".ml7",
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
    <h1 className="ml7">
      <span className="text-wrapper">
        <span className="letters" ref={textWrapperRef}>
          {text}
        </span>
      </span>
    </h1>
  );
};

export default SeventhAnimation;
