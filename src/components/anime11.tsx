"use client";
import React, { useEffect, useRef } from "react";

import { createTimeline } from "../anime/anime";
import "./style.css";
interface AnimatedLettersProps {
  text: string;
}
const ElevenAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
  const textWrapperRef = useRef<HTMLHeadingElement>(null);
  const tl = createTimeline({
    loop: true,
  });
  useEffect(() => {
    if (textWrapperRef.current) {
      const textWrapper = textWrapperRef.current;

      textWrapper.innerHTML = textWrapper.textContent!.replace(
        /([^\x00-\x80]|\w)/g,
        "<span class='letter'>$&</span>"
      );

      tl.add(
        ".ml11 .line",
        {
          scaleY: { from: 0, to: 1 },
          opacity: { from: 0.5, to: 1 },
          duration: 700,
          ease: "outExpo",
        },
        0
      )
        .add(
          ".ml11 .line",
          {
            translateX: {
              from: 0,
              to: textWrapperRef.current.getBoundingClientRect().width + 10,
            },
            duration: 700,
            ease: "outExpo",
            delay: 100,
          },
          "<="
        )
        .add(
          ".ml11 .letter",
          {
            opacity: { from: 0, to: 1 },
            duration: 600,
            ease: "outExpo",
            delay: (el, i) => 34 * (i + 1),
          },
          "<-=775"
        )
        .add(
          ".ml11",
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
    <h1 className="ml11">
      <span className="text-wrapper">
        <span className="line line1"></span>
        <span className="letters" ref={textWrapperRef}>
          {text}
        </span>
      </span>
    </h1>
  );
};

export default ElevenAnimation;
