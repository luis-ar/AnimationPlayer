"use client";
import React, { useEffect, useRef } from "react";
import { animate, Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const FlyInAnimation: React.FC<AnimatedLetterProps> = ({ timeLine }) => {
  useEffect(() => {
    timeLine.add(
      ".ml18",
      {
        translateX: { from: "-100%", to: "0%" },
        opacity: { from: 0, to: 1 },
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
      <div className="ml18">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default FlyInAnimation;
