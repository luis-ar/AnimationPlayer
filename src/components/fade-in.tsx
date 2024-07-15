"use client";
import React, { useEffect } from "react";
import { Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const FadeInAnimation: React.FC<AnimatedLetterProps> = ({ timeLine }) => {
  useEffect(() => {
    timeLine.add(
      ".ml19",
      {
        opacity: { from: 0, to: 1 },
        translateY: { from: "50%", to: "0%" },
        ease: "inOutQuint",
        duration: 1500,
        delay: (el, i) => 150 * i,
        loop: true,
      },
      0
    );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml19">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default FadeInAnimation;
