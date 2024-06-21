"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../anime/anime";
import "./style.css";

interface AnimatedLettersProps {
  text: string;
}

const FifthAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
  const animationRef = useRef(null);
  const tl = createTimeline({
    loop: true,
  });

  useEffect(() => {
    if (animationRef.current) {
      tl.add(
        ".ml5 .line",
        {
          opacity: { from: 0.5, to: 1 },
          scaleX: { from: 0, to: 1 },
          ease: "inOutExpo",
          duration: 700,
        },
        0
      )
        .add(
          ".ml5 .line",
          {
            duration: 600,
            ease: "outExpo",
            translateY: (el: any, i: number) => -0.625 + 0.625 * 2 * i + "em",
          },
          "<="
        )
        .add(
          ".ml5 .ampersand",
          {
            opacity: { from: 0, to: 1 },
            scaleY: { from: 0.5, to: 1 },
            ease: "inOutExpo",
            duration: 600,
          },
          "<-=600"
        )
        .add(
          ".ml5 .letters-left",
          {
            opacity: { from: 0, to: 1 },
            translateX: { from: "0.5em", to: 0 },
            ease: "outExpo",
            duration: 600,
          },
          "<-=300"
        )
        .add(
          ".ml5 .letters-right",
          {
            opacity: { from: 0, to: 1 },
            translateX: { from: "-0.5em", to: 0 },
            ease: "outExpo",
            duration: 600,
            offset: "-=600",
          },
          "<="
        )
        .add(
          ".ml5",
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
    <h1 className="ml5" ref={animationRef}>
      <span className="text-wrapper">
        <span className="line line1"></span>
        <span className="letters letters-left">Signal </span>
        <span className="letters ampersand">&amp;</span>
        <span className="letters letters-right">Noise</span>
        <span className="line line2"></span>
      </span>
    </h1>
  );
};

export default FifthAnimation;
