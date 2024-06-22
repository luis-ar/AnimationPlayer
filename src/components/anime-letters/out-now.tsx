"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
}
const OutNow: React.FC<AnimatedLettersProps> = ({ text }) => {
  const textWrapperRef = useRef<HTMLHeadingElement>(null);
  const tl = createTimeline({
    loop: true,
  });
  useEffect(() => {
    if (textWrapperRef.current) {
      tl.add(
        ".ml15 .word",
        {
          scale: { from: 14, to: 1 },
          opacity: { from: 0, to: 1 },
          ease: "outCirc",
          duration: 800,
          delay: (el, i) => 800 * i,
        },
        0
      ).add(
        ".ml15",
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
  const words = text.split(" ");

  return (
    <h1 className="ml15" ref={textWrapperRef}>
      {words.map((word, index) => (
        <span key={index} className="word">
          {word}
        </span>
      ))}
    </h1>
  );
};

export default OutNow;
