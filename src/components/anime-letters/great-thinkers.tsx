"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLetterProps {
  text: string;
}
const GreatThinkers: React.FC<AnimatedLetterProps> = ({ text }) => {
  const textWrapperRef = useRef<HTMLHeadingElement>(null);
  const tl = createTimeline({
    loop: true,
  });
  useEffect(() => {
    if (textWrapperRef.current) {
      const textWrapper = textWrapperRef.current;

      textWrapper.innerHTML = "";
      const words = text.split(" ");

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        word.split("").forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.className = "letter";
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
        });
        textWrapper.appendChild(wordSpan);
        if (wordIndex < words.length - 1) {
          textWrapper.appendChild(document.createTextNode(" "));
        }
      });

      tl.add(
        ".ml3 .letter",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 2250,
          delay: (el, i) => 150 * (i + 1),
        },
        0
      ).add(
        ".ml3",
        {
          opacity: 0,
          ease: "outExpo",
          duration: 1000,
          delay: 1000,
        },
        "<="
      );
    }
  }, []);
  return (
    <h1 ref={textWrapperRef} className="ml3">
      {text}
    </h1>
  );
};

export default GreatThinkers;
