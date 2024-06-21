"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../anime/anime";
import "./style.css";

interface AnimatedLettersProps {
  text: string;
}
const TenthAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
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
        ".ml10 .letter",
        {
          rotateY: { from: -90, to: 0 },
          duration: 1300,
          delay: (el, i) => 45 * i,
        },
        0
      ).add(
        ".ml10",
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
    <h1 className="ml10">
      <span className="text-wrapper">
        <span className="letters" ref={textWrapperRef}>
          {text}
        </span>
      </span>
    </h1>
  );
};

export default TenthAnimation;
