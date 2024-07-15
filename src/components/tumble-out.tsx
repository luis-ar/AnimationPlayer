"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate, Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const TumbleOutAnimation: React.FC<AnimatedLetterProps> = ({ timeLine }) => {
  useEffect(() => {
    timeLine.add(
      ".ml31",
      {
        translateY: { from: "0%", to: "-100%" },
        translateX: { from: "0%", to: "120%" },
        rotate: { from: 0, to: 60 },
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
      <div className="ml31">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default TumbleOutAnimation;
