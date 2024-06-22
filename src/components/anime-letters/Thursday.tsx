"use client";
import React, { useEffect, useRef } from "react";
import "../style.css";
import { createTimeline } from "../../anime/anime";

interface AnimatedLetterProps {
  text: string;
}
const Thursday: React.FC<AnimatedLetterProps> = ({ text }) => {
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
        ".ml1 .letter",
        {
          scale: { from: 0.3, to: 1 },
          opacity: { from: 0, to: 1 },
          translateZ: 0,
          ease: "outExpo",
          duration: 1000,
          delay: (el, i) => 70 * (i + 1),
        },
        0
      )
        .add(
          ".ml1 .line",
          {
            scaleX: { from: 0, to: 1 },
            opacity: { from: 0.5, to: 1 },
            ease: "outExpo",
            duration: 700,
            delay: (el, i, l) => 80 * (l - i),
          },
          "<-=875"
        )
        .add(
          ".ml1",
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
    <div>
      <h1 className="ml1">
        <span className="text-wrapper">
          <span className="line line1"></span>
          <span className="letters" ref={textWrapperRef}>
            {text}
          </span>
          <span className="line line2"></span>
        </span>
      </h1>
    </div>
  );
};

export default Thursday;
