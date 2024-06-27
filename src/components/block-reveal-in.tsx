"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate, Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const BlockRevealInAnimation: React.FC<AnimatedLetterProps> = ({
  timeLine,
}) => {
  useEffect(() => {
    timeLine
      .add(
        ".ml22 .block",
        {
          width: { from: "80%", to: "100%" },
          ease: "linear",
          duration: 100,
          delay: (el, i) => 70 * i,
        },
        0
      )
      .add(
        ".ml22 .block",
        {
          left: "100%",
          width: { from: "101%", to: "0%" },
          ease: "linear",
          duration: 1200,
          delay: (el, i) => 70 * i,
        },
        "<="
      );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml22">
        <div className="block"></div>
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default BlockRevealInAnimation;
