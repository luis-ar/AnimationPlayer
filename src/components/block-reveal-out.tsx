"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate, Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const BlockRevealOutAnimation: React.FC<AnimatedLetterProps> = ({
  timeLine,
}) => {
  useEffect(() => {
    timeLine
      .add(
        ".ml32 .block",
        {
          width: { from: "70%", to: "100%" },
          ease: "linear",
          duration: 1000,
          delay: (el, i) => 70 * i,
        },
        0
      )
      .add(
        ".ml32",
        {
          width: { from: "100%", to: "0%" },
          ease: "linear",
          duration: 1200,
        },
        "<="
      );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml32">
        <div className="block"></div>
        <img
          className="item"
          src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg"
        />
      </div>
    </div>
  );
};

export default BlockRevealOutAnimation;
