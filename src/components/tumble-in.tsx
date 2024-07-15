"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate, Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const TumbleInAnimation: React.FC<AnimatedLetterProps> = ({ timeLine }) => {
  useEffect(() => {
    timeLine.add(
      ".ml23",
      {
        translateY: { from: "-50%", to: "0%" },
        translateX: { from: "-100%", to: "0%" },

        rotate: { from: -60, to: 0 },
        ease: "outExpo",
        duration: 2000,
        delay: (el, i) => 70 * i,
        loop: true,
      },
      0
    );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml23">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default TumbleInAnimation;
