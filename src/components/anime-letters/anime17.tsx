"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
}
const SeventeenAnimation: React.FC<AnimatedLettersProps> = ({ text }) => {
  const textWrapperRef = useRef<HTMLHeadingElement>(null);
  const tl = createTimeline({
    loop: true,
  });
  useEffect(() => {
    if (textWrapperRef.current) {
      tl.add(
        ".ml17 .container1",
        {
          width: { from: "0%", to: "100%" },
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
        },
        0
      )
        .add(
          ".ml17 .text1",
          {
            top: { from: "200%", to: "0%" },
            ease: "inOutQuad",
            duration: 1000,
          },
          "-=800"
        )
        .add(
          ".ml17 .container2",
          {
            width: { from: "0%", to: "100%" },
            ease: "inOutQuad",
            duration: 1000,
          },
          "-=900"
        )
        .add(
          ".ml17 .text2",
          {
            top: { from: "110px", to: "0px" },
            ease: "inOutQuad",
            duration: 1000,
          },
          "-=800"
        )
        .add(
          ".ml17 .container1 .circle",
          {
            scale: { from: 0, to: 1 },
            ease: "inOutExpo",
            duration: 1000,
          },
          "-=800"
        )
        .add(
          ".ml17 .container1",
          {
            bottom: { from: "0%", to: "70%" },
            opacity: 1,
            ease: "inOutQuad",
            duration: 1000,
          },
          "-=1000"
        )
        .add(
          ".ml17 .container2",
          {
            top: { from: "0%", to: "30%" },
            opacity: 1,
            easing: "easeInOutQuad",
            duration: 1000,
          },
          "-=1000"
        );
    }
  }, [text]);
  return (
    <div className="ml17" ref={textWrapperRef}>
      <div className="container container1">
        <div className="circle"></div>
        <div className="containerText1">
          <span className="text1">Hola</span>
        </div>
      </div>
      <div className="container container2">
        <div className="containerText2">
          <span className="text2">Luis</span>
        </div>
      </div>
    </div>
  );
};

export default SeventeenAnimation;
