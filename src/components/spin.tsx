"use client";
import React, { useEffect } from "react";
import { Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const SpinAnimation: React.FC<AnimatedLetterProps> = ({ timeLine }) => {
  useEffect(() => {
    timeLine.add(
      ".ml26",
      {
        rotate: {
          to: 360,
          duration: 1000,
          delay: 100,
          ease: "inOutCirc",
        },
      },
      0
    );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml26">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default SpinAnimation;
